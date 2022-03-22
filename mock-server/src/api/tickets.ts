import { Router } from "express";
import { attendees } from "../datastore";
import { extractOneHeader, getEvent } from "./utill";

export default function checkInInitialize(router: Router) {
    router.get("/:eventId/tickets/:ticketID", (req, res) => {
        let ticketID = parseInt(req.params.ticketID);
        let barcodeID = parseInt(extractOneHeader(req, "barcode_id") as string);


        let event = getEvent(req, res);
        if (event === null) {
            return;
        }

        let matchingAttendee = attendees.get(event.id)?.map(
            (attendee) => {
                let matchingEventlets = attendee.attendances.filter(
                    (eventlet) => eventlet.ticket_number===barcodeID && eventlet.id===ticketID
                )
                return matchingEventlets[0];
            }
        ).find((x)=>x);
        
        if (!matchingAttendee) {
            res.status(404);
            res.json({ "error": "attendee not found" });
            return;
        }
        
        res.json(matchingAttendee);
    })
}
