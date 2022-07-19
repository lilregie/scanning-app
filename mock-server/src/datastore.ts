import { LilRegieEvent } from "./mockInterfaces/event";
import { Attendee } from "./mockInterfaces/attendee";
import { generateEvent } from "./mockGeneration/events";
import { generateAttendeesForEvent } from "./mockGeneration/attendees";

export let events: LilRegieEvent[] = [];
export let attendees: Map<number, Attendee[]> = new Map();

for (let i = 0; i < 24; i++) {
    events.push(generateEvent(i%2===0 ? 'attendee' : 'ticket_only'));
}

for (const event of events) {
    attendees.set(event.id, generateAttendeesForEvent(event));
}