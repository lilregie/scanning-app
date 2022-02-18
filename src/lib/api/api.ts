import { get } from 'svelte/store';
import type { Attendee } from '../attendee';
import type { Event } from '../event';
import { allEvents, chosenEventID, eventAttendees } from '../store';
import {findByKey} from "$lib/utill"
import { request } from './request';
import { apiProduction, csrfAPIState, errorAPICallbacks } from './statusStores';

export async function initializeAPI() {
	console.log('initializeAPI');

	// Load CSRF token
	let metaTag = document.querySelector('meta[name=csrf-token]') as HTMLMetaElement;
	const CSRF_TOKEN = metaTag?.content;
	csrfAPIState.set(CSRF_TOKEN);
	if (CSRF_TOKEN==="testing-token") {
		console.warn("API in DEV mode");
		apiProduction.set(false);
	} else if (!CSRF_TOKEN) {
		console.error("Error: API token not found",metaTag);
		return
	} else {
		console.log("API in production mode");
		apiProduction.set(true);

	}

	console.log('Loading Events');
	await getEventsList();
}

export async function getEventsList() {
	console.log('Loading Events');
	let result = await request.get('.json', {});
	let events: Event[] = await result.json();
	console.log("Generated Events", events);
	allEvents.set(events);
}

export async function getAttendeesList(eventID: string) {
	try {
		let result = await request.get(`/${eventID}/attendees.json`, {});
		if (result.status == 404) {
			console.log("Event not found");
		} else {
			let attendees: Attendee[] = (await result.json()).map(attendee=>{
				attendee.checked_in_at = typeof attendee.checked_in_at === "string" && new Date(attendee.checked_in_at) || null
				return attendee
			});
			eventAttendees.set(attendees);
		}
	} catch {
		console.log("Failed to get event attendees");
	}

}

export async function createCheckIn(attendee: Attendee, manually_checked_in: boolean, vaccine_certificate: string = null, ticket_id: string = null) {
	if (findByKey(get(eventAttendees), "id", attendee.id).checked_in_at !== null) {
		console.warn("Tried to create check in, when attendee is already checked in");
	}

	// Optimistically update UI
	eventAttendees.update((_eventAttendees) => {
		findByKey(_eventAttendees, "id", attendee.id).checked_in_at = new Date()

		return _eventAttendees;
	})
	try {
		const checkInData = await request.post(`/${get(chosenEventID)}/attendees/${attendee.id}/checkin`, {}, {});
		if (checkInData.status !== 200) {
			console.error("Failed to create checkin", checkInData.status, checkInData.text());
			// Undo UI update
			eventAttendees.update((_eventAttendees) => {
				findByKey(_eventAttendees, "id", attendee.id).checked_in_at = null
				return _eventAttendees;
			})
		}
	} catch {
		console.log("Failed to create checkin, server not responding");
		// Undo UI update
		eventAttendees.update((_eventAttendees) => {
			findByKey(_eventAttendees, "id", attendee.id).checked_in_at = null
			return _eventAttendees;
		})
		errorAPICallbacks.update((_errorAPICallbacks) => {
			_errorAPICallbacks.push(() => {
				createCheckIn(attendee, manually_checked_in, vaccine_certificate, ticket_id);
			})
			return _errorAPICallbacks
		})

	}

}

export async function removeLatestCheckIn(attendee: Attendee) {
	if (findByKey(get(eventAttendees), "id", attendee.id).checked_in_at === null) {
		console.warn("Trying to remove check in, but attendee is not checked in");
	}


	// Optimistically update UI
	eventAttendees.update((_eventAttendees) => {
		findByKey(_eventAttendees, "id", attendee.id).checked_in_at = null;
		return _eventAttendees;
	})
	try {
		const checkInData = await request.delete_(`/${get(chosenEventID)}/attendees/${attendee.id}/checkin`, {}, {});
		if (checkInData.status === 204) {
			console.log("Successfully removed checkin");
		} else if (checkInData.status === 422) {
			console.log("Tried to remove check-in, but it doesn't exist server-side");
		}
	} catch {
		console.log("Failed to remove checkin");
		// Undo UI update
		eventAttendees.update((_eventAttendees) => {
			findByKey(_eventAttendees, "id", attendee.id).checked_in_at = new Date();
			return _eventAttendees;
		})
		errorAPICallbacks.update((_errorAPICallbacks) => {
			_errorAPICallbacks.push(() => {
				removeLatestCheckIn(attendee);
			})
			return _errorAPICallbacks
		})
	}


}