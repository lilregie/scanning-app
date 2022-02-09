import { Router } from "express";
import eventsInitialize from "./events";
import attendeeInitialize from "./attendees";
import checkInInitialize from "./checkIn";

export function apiInitializeWithRouter(router: Router) {
    eventsInitialize(router)
    attendeeInitialize(router)
    checkInInitialize(router)
}