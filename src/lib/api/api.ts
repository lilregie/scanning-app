import { get } from 'svelte/store';
import type { Attendee, EventletAttendance } from '../attendee';
import type { EventDetails } from '../event';
import { allEvents, currentEventID, allEventAttendees, currentEvent } from '../store';
import {findByKey} from "$lib/utill"
import { request } from './request';
import { apiProduction, csrfAPIState, errorAPICallbacks } from './statusStores';
import type { AttendeeProfile } from '$lib/components/checkInSteps/stepManager';

export function csrfToken() {
	const metaTag = document.querySelector<HTMLMetaElement>('meta[name=csrf-token]');

	return metaTag?.content;
}

export async function initializeAPI() {
	console.log('initializeAPI');

	// Load CSRF token
	const CSRF_TOKEN = csrfToken()
	csrfAPIState.set(CSRF_TOKEN ?? null);

	if (CSRF_TOKEN === "testing-token") {
		console.warn("API in DEV mode");
		apiProduction.set(false);
	} else if (!CSRF_TOKEN) {
		console.error("Error: API token not found");
	} else {
		console.log("API in production mode");
		apiProduction.set(true);
	}
}

export async function getEventsList() {
	const result = await request.get({ route: '.json' });
	const events: EventDetails[] = await result.json();

	allEvents.set(events);
}

export async function getAttendeesList(eventID: string) {
	try {
		let result = await request.get({route: `/${eventID}/attendees.json`});
		if (result.status == 404) {
			console.log("Event not found");
		} else {
			let attendees: Attendee[] = (await result.json()).map((attendee: Attendee)=>{
				attendee.checked_in_at = typeof attendee.checked_in_at === "string" && new Date(attendee.checked_in_at) || null
				return attendee
			});
			allEventAttendees.set(attendees);
		}
	} catch {
		console.log("Failed to get event attendees");
	}
}

export async function createCheckIn(attendeeProfile: AttendeeProfile) {
	let {attendee, covidPass, ticketKey, checkInEventlet} = attendeeProfile;

	const event = get(currentEvent);
	if (!event) {
		console.error("Tried to create checkin before events loaded");
		return
	}

	// Required Data
	if (!attendee) {
		console.error("Tried to check-in attendee without an attendee selected: ",attendee, attendeeProfile);
		return
	}
	if (!checkInEventlet && !event.standalone) {
		console.error("Tried to check-in attendee without an attendance selected: ", attendeeProfile);
		return
	} else if (!checkInEventlet) {
		checkInEventlet = event.eventlets[0];
	}

	// First get attendance
	let attendance = attendee.attendances.find((x: EventletAttendance)=>x.eventlet_id==checkInEventlet?.id);
	if (!attendance) {
		console.error("Tried to check-in attendee without a valid attendance selected: ", attendeeProfile);
		return
	}

	if (attendee.checked_in_at !== null) {
		console.warn("Tring to create check in, when attendee is already checked in");
	}

	// So we can revert changes
	let startingAttendeeCheckInDate: Date | null = null;
	let startingAttendeeVaccinePass: boolean;

	// Optimistically update UI
	allEventAttendees.update((_eventAttendees) => {
		if (!_eventAttendees) {
			console.warn("Tried to update attendee before attendees loaded");
			return _eventAttendees
		}
		// Get mutable reference to attendee
		let selectedAttendee = findByKey(_eventAttendees, "id", attendee?.id);
		if (typeof selectedAttendee === "undefined") {
			console.error("Tried to checkin attendee that is does not exist");
			return _eventAttendees;
		}

		// Save current state so we can revert if request fails
		startingAttendeeCheckInDate = selectedAttendee.checked_in_at;
		startingAttendeeVaccinePass = selectedAttendee.vaccine_pass;

		// Apply changes
		selectedAttendee.checked_in_at = new Date();
		selectedAttendee.vaccine_pass = selectedAttendee.vaccine_pass || covidPass;

		return _eventAttendees;
	});

	try {
		const checkInData = await request.post({
			route: `/${get(currentEventID)}/attendances/${attendance.id}/checkin`,
			body: {
				vaccine_pass: covidPass,
				ticket_uuid: attendee.ticket_uuid
			},
		});

		if (checkInData.status !== 200) {
			console.error("Failed to create checkin", checkInData.status, checkInData.text());

			throw new Error("Failed to create checkin");
		}
	} catch {
		console.log("Failed to create checkin, server not responding");

		// Undo UI update
		allEventAttendees.update((eventAttendees) => {
			if (eventAttendees === null) return null;

			const selectedAttendee = findByKey(eventAttendees, "id", attendee?.id);

			if (selectedAttendee !== undefined) {
				selectedAttendee.checked_in_at = startingAttendeeCheckInDate;
				selectedAttendee.vaccine_pass = startingAttendeeVaccinePass;
			}

			return eventAttendees;
		})
		errorAPICallbacks.update((_errorAPICallbacks) => {
			_errorAPICallbacks.push(() => {
				createCheckIn(attendeeProfile);
			})
			return _errorAPICallbacks
		})
	}
}

export async function removeLatestCheckIn(attendee: Attendee) {

	// So we can undo the UI update
	let checkInDate: Date | null;

	// Optimistically update UI
	allEventAttendees.update((_eventAttendees) => {
		if (!_eventAttendees) {
			console.warn("Tried to update attendee before attendees loaded");
			return _eventAttendees
		}

		const selectedAttendee = findByKey(_eventAttendees, "id", attendee.id);
		if (typeof selectedAttendee === "undefined") {
			console.error("Tried to remove checkin for attendee that is does not exist");
			return _eventAttendees;
		}
		checkInDate = selectedAttendee.checked_in_at;
		if (checkInDate === null) {
			console.warn("Trying to remove check in, but attendee is not checked in");
		}
		selectedAttendee.checked_in_at = null;
		return _eventAttendees;
	})
	try {
		const checkInData = await request.delete_({route: `/${get(currentEventID)}/attendances/${attendee.id}/checkin`});
		if (checkInData.status === 204) {
			console.log("Successfully removed checkin");
		} else if (checkInData.status === 422) {
			console.log("Tried to remove check-in, but it doesn't exist server-side");
		}
	} catch {
		console.log("Failed to remove checkin");
		// Undo UI update
		allEventAttendees.update((_eventAttendees) => {
			if (!_eventAttendees) { return _eventAttendees }

			const selectedAttendee = findByKey(_eventAttendees, "id", attendee.id);
			if (typeof selectedAttendee === "undefined") {
				console.error("Tried to undo remove checkin for attendee that is does not exist");
				return _eventAttendees;
			}
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
