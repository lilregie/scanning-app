import { Request, Response, Router } from "express";
import { attendees, events } from "./datastore";
import { Attendee } from "../mockInterfaces/attendee";


console.log(attendees)

export default function attendeeInitialize(router: Router) {
    router.get("/events/:eventId/attendees.json", (req, res) => {
        let eventId = req.params.eventId;
        let matchingEvent = events.filter((event) => event.id === eventId);

        console.log(eventId)
        if (matchingEvent.length === 1) {
            res.json(attendees.get(eventId));
        } else {
            res.status(404);
            res.json({"error": "event not found"});
        }
    });

    router.get("/events/:eventId/attendees/:attendeeId.json", (req: Request, res: Response) => {
        let eventId = req.params.eventId;
        let attendeeId = req.params.attendeeId;

        let matchingEvent = events.filter((event) => event.id === eventId);

        if (matchingEvent.length === 1) {
            let matchingAttendees = attendees.get(eventId).filter((attendee) => attendee.id === attendeeId);
            if (matchingAttendees.length === 1) {
                res.json(matchingAttendees[0]);
            } else {
                res.status(404);
                res.json({"error": "attendee not found"});
            }
        }  else {
            res.status(404);
            res.json({"error": "event not found"});
        }
    });
}
