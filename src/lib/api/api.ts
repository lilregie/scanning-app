import { get } from 'svelte/store';
import type { Attendee } from '../attendee';
import type { LilRegieEvent } from '../event';
import { allEvents, currentEventID, eventletAttendees, allEventAttendees } from '../store';
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
	let events: LilRegieEvent[] = await result.json();
	events.map((event)=>{
		return event.eventlets.map((eventlet)=>{
			eventlet.datetime_start = new Date(eventlet.datetime_start) || null;
			eventlet.datetime_end = new Date(eventlet.datetime_end) || null;
			return eventlet;
		})
	})
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
			allEventAttendees.set(attendees);
		}
	} catch {
		console.log("Failed to get event attendees");
	}

}

export async function createCheckIn(attendee: Attendee, manually_checked_in: boolean, vaccine_certificate: string = null, ticket_id: number = null) {
	if (findByKey(get(allEventAttendees), "id", attendee.id).checked_in_at !== null) {
		console.warn("Tried to create check in, when attendee is already checked in");
	}

	// So we can revert changes
	let startingAttendeeCheckInDate = null;
	let startingAttendeeVaccinePass = null;

	// Optimistically update UI
	allEventAttendees.update((_eventAttendees) => {
		// Get mutable reference to attendee
		let selectedAttendee = findByKey(_eventAttendees, "id", attendee.id);

		// Save current state so we can revert if request fails
		startingAttendeeCheckInDate = selectedAttendee.checked_in_at;
		startingAttendeeVaccinePass = selectedAttendee.vaccine_pass;

		// Apply changes
		selectedAttendee.checked_in_at = new Date();
		selectedAttendee.vaccine_pass = !!vaccine_certificate;

		return _eventAttendees;
	});

	const requestHeaders: HeadersInit = new Headers();
	requestHeaders.set('vaccine_pass', (!!vaccine_certificate).toString());
	if (ticket_id) {
		requestHeaders.set('ticket_id', ticket_id.toString());
	}
	console.log("Checking in with",requestHeaders)

	try {

		const checkInData = await request.post(
			`/${get(currentEventID)}/attendees/${attendee.id}/checkin`,
			{},
			{headers: requestHeaders}
		);

		if (checkInData.status !== 200) {

			console.error("Failed to create checkin", checkInData.status, checkInData.text());

			// Undo UI update
			allEventAttendees.update((_eventAttendees) => {
				findByKey(_eventAttendees, "id", attendee.id).checked_in_at = null
				return _eventAttendees;
			})
		}
	} catch {

		console.log("Failed to create checkin, server not responding");

		// Undo UI update
		allEventAttendees.update((_eventAttendees) => {
			let selectedAttendee = findByKey(_eventAttendees, "id", attendee.id);
			selectedAttendee.checked_in_at = startingAttendeeCheckInDate;
			selectedAttendee.vaccine_pass = startingAttendeeVaccinePass;
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
	if (findByKey(get(allEventAttendees), "id", attendee.id).checked_in_at === null) {
		console.warn("Trying to remove check in, but attendee is not checked in");
	}

	// So we can undo the UI update
	let checkInDate = null;

	// Optimistically update UI
	allEventAttendees.update((_eventAttendees) => {
		let selectedAttendee = findByKey(_eventAttendees, "id", attendee.id);
		checkInDate = selectedAttendee.checked_in_at;
		selectedAttendee.checked_in_at = null;
		return _eventAttendees;
	})
	try {
		const checkInData = await request.delete_(`/${get(currentEventID)}/attendees/${attendee.id}/checkin`, {}, {});
		if (checkInData.status === 204) {
			console.log("Successfully removed checkin");
		} else if (checkInData.status === 422) {
			console.log("Tried to remove check-in, but it doesn't exist server-side");
		}
	} catch {
		console.log("Failed to remove checkin");
		// Undo UI update
		allEventAttendees.update((_eventAttendees) => {
			let selectedAttendee = findByKey(_eventAttendees, "id", attendee.id);
			selectedAttendee.checked_in_at = checkInDate;
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
