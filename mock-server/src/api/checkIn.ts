import { Router } from "express";
import { CheckInError } from "../mockInterfaces/checkIn";
import { CheckIn } from "../mockInterfaces/checkIn";
import { extractOneHeader, getAttendee } from "./utill";

import {faker} from '@faker-js/faker';
import { validate as uuidValidate } from "uuid";


export default function checkInInitialize(router: Router) {
    router.post("/:eventId/attendances/:attendanceId/checkin", (req, res) => {
        console.log(req.params)
        let attendee = getAttendee(req, res);
        if (attendee === null) {
            return;
        }
        let attendance = attendee.attendances.find((attendance) => attendance.id === parseInt(req.params.attendanceId));
        if (!attendance) {
            res.status(404);
            res.json({ "error": "attendance not found" });
            return;
        }
        
        let contentType = extractOneHeader(req, "content-type");
        if (contentType !== "application/json") {
            res.status(400);
            res.json({ "error": "should have a json body/content type" });
            return;
        }
        let vaccinePassHeader = req.body?.vaccine_pass;
        let ticketUuidHeader = req.body?.ticket_uuid;
        console.log(ticketUuidHeader, vaccinePassHeader);

        if (!uuidValidate(ticketUuidHeader as string) || vaccinePassHeader === undefined) {
            res.status(400);
            res.json({ "error": "missing valid ticket_uuid or vaccine_pass" });
            return;
        }

        let valid = attendee.ticket_uuid === ticketUuidHeader;
        
        if (!valid) {
            res.status(404);
            res.json({ "error": "ticket not found on attendee" } as CheckInError);
            return;
        }

        // Only validate ticket if included in request
        console.log("New CheckIn:",attendee.id);
        
        attendee.checked_in_at = new Date();
        attendee.vaccine_pass = vaccinePassHeader || attendee.vaccine_pass;
        attendance.checked_in_at = attendee.checked_in_at


        let result: CheckIn = {
            id: faker.datatype.number(),
            attendee_id: attendee.id,
            checked_in_at: attendee.checked_in_at,
            checkin_user_id: faker.datatype.number(),
            vaccine_pass: attendee.vaccine_pass
        };
        res.json(result)
    });

    router.delete("/:eventId/attendances/:attendanceId/checkin", (req, res) => {
        let attendee = getAttendee(req, res);
        if (attendee === null) {
            return;
        }

        res.setHeader("accepted",attendee.checked_in_at===null ? "false" : "true");
        
        if (attendee.checked_in_at===null) {
            console.log("Tried to delete CheckIn:",attendee.id, "but they were not checked in")
            res.status(422);
        } else {
            console.log("Deleted CheckIn:",attendee.id)
            attendee.checked_in_at = null;
            res.status(204);
        }
        res.end();

    })
}
