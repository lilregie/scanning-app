import { Router } from "express";
import { CheckInError } from "../mockInterfaces/checkIn";
import { CheckIn } from "../mockInterfaces/checkIn";
import { extractOneHeader, getAttendee } from "./utill";

import {faker} from '@faker-js/faker';


export default function checkInInitialize(router: Router) {
    router.post("/:eventId/attendances/:attendeeId/checkin", (req, res) => {
        let attendee = getAttendee(req, res);
        if (attendee === null) {
            res.status(400);
            res.json({ "error": "attendee not found" });
            return;
        }
        
        let ticketIdHeader = extractOneHeader(req, "ticket_uuid");
        let vaccinePassHeader = extractOneHeader(req, "vaccine_pass");
        console.log(ticketIdHeader, vaccinePassHeader);

        if (!parseInt(ticketIdHeader as string) || !vaccinePassHeader) {
            res.status(400);
            res.json({ "error": "missing valid ticket_id or vaccine_pass" });
            return;
        }

        let valid = attendee.ticket_uuid === ticketIdHeader;
        
        if (!valid) {
            res.status(404);
            res.json({ "error": "ticket not found on attendee" } as CheckInError);
            return;
        }

        // Only validate ticket if included in request
        console.log("New CheckIn:",attendee.id);
        
        attendee.checked_in_at = new Date();
        attendee.vaccine_pass = attendee.vaccine_pass || vaccinePassHeader?.toLowerCase()==="true";


        let result: CheckIn = {
            id: faker.datatype.number(),
            attendee_id: attendee.id,
            checked_in_at: attendee.checked_in_at,
            checkin_user_id: faker.datatype.number(),
            vaccine_pass: attendee.vaccine_pass
        };
        res.json(result)
    });

    router.delete("/:eventId/attendances/:attendeeId/checkin", (req, res) => {
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
