import { generateEvent } from '$lib/mocks/eventMock';
import { get } from 'svelte/store';
import type { Attendee } from './attendee';
import type { Event } from './event';
import { generateAttendeesForEvent } from './mocks/attendeeMock';
import { allEvents, eventAttendees } from './store';
import {findByKey} from "$lib/utill"

export function initializeAPI() {
	console.log('Initializing API', get(allEvents));
	if (get(allEvents).length === 0) {
		console.log('Loading Events');
		getEventsList();
	}
}

export function getEventsList() {
	let events: Event[] = [];
	for (let i = 0; i < 3; i++) {
		events.push(generateEvent());
	}
	console.log(events);
	allEvents.set(events);
}

export function getAttendeesList() {
	eventAttendees.set(generateAttendeesForEvent())
}

export function createCheckIn(attendee: Attendee, manually_checked_in: boolean, vaccine_certificate: string = null, ticket_id: string = null) {
	// Would send post to API, then use attendee.id from response
	eventAttendees.update((_eventAttendees) => {
		findByKey(_eventAttendees, "id", attendee.id).check_ins.push(
			{
				time: new Date(),
				id: 0,
				attendee_id: attendee.id,
				vaccine_certificate,
				ticket_id,
				manually_checked_in,
			}
		);
		return _eventAttendees;
	})
	

	
}