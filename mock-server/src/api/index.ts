import { Router } from "express";
import eventsInitialize from "./events";
import attendeeInitialize from "./attendees";

export function apiInitializeWithRouter(router: Router) {
    eventsInitialize(router)
    attendeeInitialize(router)
}