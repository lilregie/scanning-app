import { get } from 'svelte/store';
import type { Attendee } from '../attendee';
import type { Event } from '../event';
import { allEvents, eventAttendees } from '../store';
import {findByKey} from "$lib/utill"
import { request } from './request';

export async function initializeAPI() {
	console.log('initializeAPI');

	// Load CSRF token
	let metaTag = document.querySelector('meta[name=csrf-token]') as HTMLMetaElement;
	const CSRF_TOKEN = metaTag?.content;
	if (CSRF_TOKEN==="testing-token") {
		console.warn("API in DEV mode");

	} else if (!CSRF_TOKEN) {
		console.error("Error: API token not found",metaTag);
		return
	}

	console.log('Initializing API', get(allEvents));
	console.log('Loading Events');
	await getEventsList();
}

export async function getEventsList() {
	console.log('Loading Events');
	let result = await request.get('/events.json', {});
	let events: Event[] = await result.json();
	console.log("Generated Events", events);
	allEvents.set(events);
}

export async function getAttendeesList(eventID: string) {
	let result = await request.get(`/events/${eventID}/attendees.json`, {});
	if (result.status == 404) {
		console.log("Event not found");
	} else {
		let attendees: Attendee[] = (await result.json()).map(attendee=>{
			attendee.checked_in_at = typeof attendee.checked_in_at === "string" && new Date(attendee.checked_in_at) || null
			return attendee
		});
		eventAttendees.set(attendees);
	}
}

export function createCheckIn(attendee: Attendee, manually_checked_in: boolean, vaccine_certificate: string = null, ticket_id: string = null) {
	// Would send post to API, then use attendee.id from response
	eventAttendees.update((_eventAttendees) => {
		findByKey(_eventAttendees, "id", attendee.id).checked_in_at = new Date()
		// .push(
		// 	{
		// 		time: new Date(),
		// 		id: 0,
		// 		attendee_id: attendee.id,
		// 		vaccine_certificate,
		// 		ticket_id,
		// 		manually_checked_in,
		// 	}
		// );
		return _eventAttendees;
	})
}

export function removeLatestCheckIn(attendee: Attendee) {
	// Would send post to API, then use attendee.id from response
	eventAttendees.update((_eventAttendees) => {
		findByKey(_eventAttendees, "id", attendee.id).checked_in_at = null;
		return _eventAttendees;
	})
}