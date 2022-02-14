import { Request, Response, Router } from "express";
import { attendees, events } from "../datastore";
import { getAttendee } from "./utill";


export default function attendeeInitialize(router: Router) {
    router.get("/:eventId/attendees.json", (req, res) => {
        let eventId = parseInt(req.params.eventId);
        let matchingEvent = events.filter((event) => event.id === eventId);

        if (matchingEvent.length === 1) {
            console.log("Get Attendees for event:",eventId);
            res.json(attendees.get(eventId));
        } else {
            res.status(404);
            res.json({"error": "event not found"});
        }
    });

    router.get("/:eventId/attendees/:attendeeId.json", (req: Request, res: Response) => {
        let attendee = getAttendee(req, res);
        if (attendee === null) {
            return;
        }
        console.log("Got Attendee:",attendee.id)
        res.json(attendee);
    });
}
