import { Router } from "express";
import { attendees } from "../datastore";
import { getAttendee, getEvent } from "./utill";



export default function checkInInitialize(router: Router) {
    router.get("/:eventId/tickets/:ticketID", (req, res) => {
        let ticketID = req.params.ticketID;
        let barcode_id = req.headers.barcode_id;


        let event = getEvent(req, res);
        if (event === null) {
            return;
        }

        let matchingAttendees = attendees.get(event.id)?.filter((attendee) => attendee.ticket_id === ticketID);
        
        if (matchingAttendees?.length !== 1) {
            res.status(404);
            res.json({ "error": "attendee not found" });
            return;
        }
        
        // security to its finest
        res.json({valid: barcode_id?.length === 6});
    })
}
