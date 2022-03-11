import faker from "@faker-js/faker";
import { Router } from "express";
import { getAttendee } from "./utill";



export default function checkInInitialize(router: Router) {
    router.post("/:eventId/attendees/:attendeeId/checkin", (req, res) => {
        let attendee = getAttendee(req, res);
        if (attendee === null) {
            return;
        }
        
        const extractOneHeader = (x: string): string | null => {
            let header = req.headers[x];
            if (Array.isArray(header)) {
                header = header[0];
            }
            return header || null;
        }

        let ticketIdHeader = extractOneHeader("ticket_id");
        let vaccinePassHeader = extractOneHeader("vaccine_pass");
        console.log("asdasd",ticketIdHeader,vaccinePassHeader,req.headers)

        // Only validate ticket if included in request
        if ((ticketIdHeader === null) || attendee.ticket_id === parseInt(ticketIdHeader)) {
            console.log("New CheckIn:",attendee.id);
            
            attendee.checked_in_at = new Date();
            attendee.vaccine_pass = attendee.vaccine_pass || vaccinePassHeader?.toLowerCase()==="true";

            res.json({
                id: faker.datatype.number(),
                attendee_id: attendee.id,
                checked_in_at: attendee.checked_in_at,
                checkin_user_id: faker.datatype.number(),
            })
        } else {
            res.json({ "error": "ticket_id does not match attendee" });
        }
    });

    router.delete("/:eventId/attendees/:attendeeId/checkin", (req, res) => {
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
