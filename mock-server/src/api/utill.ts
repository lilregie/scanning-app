import { Request, Response, Router } from "express";
import { Attendee } from "../mockInterfaces/attendee";
import { attendees, events } from "../datastore";
import { LilRegieEvent } from "../mockInterfaces/event";

export function getAttendee(req: Request, res: Response): Attendee | null {
    let attendeeId = parseInt(req.params.attendeeId);

    let event = getEvent(req, res);
    if (event === null) {return null;}

    let matchingAttendees = attendees.get(event.id)?.filter((attendee) => attendee.id === attendeeId);

    if (matchingAttendees?.length !== 1) {
        res.status(404);
        res.json({ "error": "attendee not found" });
        return null;
    }
    return matchingAttendees[0];
}

export function getEvent(req: Request, res: Response): LilRegieEvent | null {
    let eventId = parseInt(req.params.eventId);

    let matchingEvent = events.filter((event) => event.id === eventId);

    if (matchingEvent.length !== 1) {
        res.status(404);
        res.json({ "error": "event not found" });
        return null;
    }
    return matchingEvent[0];
}