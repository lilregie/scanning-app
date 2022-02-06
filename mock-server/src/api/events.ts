import { Request, Response, Router } from "express";
import { events } from "./datastore";



export default function eventsInitialize(router: Router) {
    router.get("/events.json", (req, res) => {
        res.json(events);
    });

    router.get("/events/:eventId.json", (req: Request, res: Response) => {
        let eventId = req.params.eventId;
        let matchingEvent = events.filter((event) => event.id === eventId);
        if (matchingEvent.length === 1) {
            res.json(matchingEvent[0]);
        } else {
            res.status(404);
            res.json({"error": "event not found"});
        }
    });
}
