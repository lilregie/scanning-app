import { generateEvent } from '$lib/mocks/eventMock';
import { get } from 'svelte/store';
import type { Attendee } from './attendee';
import type { Event } from './event';
import { generateAttendeesForEvent } from './mocks/attendeeMock';
import { allEvents, eventAttendees } from './store';
import {findByKey} from "$lib/utill"

export function initializeAPI() {
	// Load CSRF token
	let metaTag = document.querySelector('meta[name=csrf-token]') as HTMLMetaElement;
	const CSRF_TOKEN = metaTag?.content;
	if (CSRF_TOKEN==="testing-token") {
		console.log("Waring: API in testing mode");
	} else if (!CSRF_TOKEN) {
		console.log("Error: API token not found",metaTag);
	}

	console.log('Initializing API', get(allEvents));
	console.log('Loading Events');
	getEventsList();
	getAttendeesList();
	// if (get(allEvents).length === 0) {
		
	// }
}

export function getEventsList() {
	let events: Event[] = [];
	for (let i = 0; i < 3; i++) {
		events.push(generateEvent());
	}
	console.log("Generated Events", events);
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