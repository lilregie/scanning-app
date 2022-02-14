import { Request, Response, Router } from "express";
import { events } from "../datastore";
import { getEvent } from "./utill";



export default function eventsInitialize(router: Router) {
    router.get("/.json", (req, res) => {
        console.log("Got All Events")
        res.json(events);
    });

    router.get("/:eventId.json", (req: Request, res: Response) => {
        let event = getEvent(req, res);
        if (event === null) {
            return;
        }
        console.log("Got Event:",event.id)
        res.json(event);
    });
}
