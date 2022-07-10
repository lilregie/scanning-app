import faker from "@faker-js/faker";
import { Router } from "express";
import { extractOneHeader, getAttendee } from "./utill";



export default function checkInInitialize(router: Router) {
    router.post("/:eventId/attendees/:attendeeId/checkin", (req, res) => {
        let attendee = getAttendee(req, res);
        if (attendee === null) {
            res.status(400);
            res.json({ "error": "attendee not found" });
            return;
        }
        
        let ticketIdHeader = extractOneHeader(req, "ticket_id");
        let vaccinePassHeader = extractOneHeader(req, "vaccine_pass");
        console.log(ticketIdHeader, vaccinePassHeader);

        if (!parseInt(ticketIdHeader as string) || !vaccinePassHeader) {
            res.status(400);
            res.json({ "error": "missing valid ticket_id or vaccine_pass" });
            return;
        }

        let eventlet = attendee.attendances.find((x) => x.id === parseInt(ticketIdHeader as string));
        
        if (!eventlet) {
            res.status(404);
            res.json({ "error": "ticket not found on attendee" });
            return;
        }

        // Only validate ticket if included in request
        console.log("New CheckIn:",attendee.id);
        
        attendee.checked_in_at = new Date();
        eventlet.checked_in_at = new Date();
        attendee.vaccine_pass = attendee.vaccine_pass || vaccinePassHeader?.toLowerCase()==="true";

        res.json(eventlet)
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
