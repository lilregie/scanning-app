import { Request, Response, Router } from "express";
import { Attendee } from "../mockInterfaces/attendee";
import { attendees, events } from "../datastore";
import { LilRegieEvent } from "../mockInterfaces/event";
import { ParsedQs } from "qs";

export function getAttendee(req: Request, res: Response): Attendee | null {
    let attendanceId = parseInt(req.params.attendanceId);

    let event = getEvent(req, res);
    if (event === null) {return null;}

    let matchingAttendee = attendees.get(event.id)?.find((attendee) => (
        attendee.attendances.some((attendance) => attendance.id === attendanceId)
    ));

    if (!matchingAttendee) {
        res.status(404);
        res.json({ "error": "attendee not found" });
        return null;
    }
    return matchingAttendee;
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

export function extractOneHeader (req: Request, x: string): string | null {
    let header = req.headers[x];
    if (Array.isArray(header)) {
        header = header[0];
    }
    return header || null;
}