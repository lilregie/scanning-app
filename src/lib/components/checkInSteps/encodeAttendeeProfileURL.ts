import { allEventAttendees, currentEvent } from "$lib/store";
import { findAttendeeByID, findEventletByID } from "$lib/utill";
import { get } from "svelte/store";
import { validate } from "uuid";
import type { AttendeeProfile } from "./stepManager";

/*
	Query Param Spec

	?attendee_id=<attendee_id>& // Attendee ID
	covid_pass& // Include if covid pass has been verified
	ticket_eventlet_id=<eventlet_id>& // Eventlet ID from ticket
	check_in_eventlet_id=<eventlet_id> // Eventlet ID to check into
*/

export function encode_url(attendeeProfile: AttendeeProfile): string {
	let searchParams = new URLSearchParams();

	if (attendeeProfile.attendee) {
		searchParams.append("attendee_id", attendeeProfile.attendee.id.toString());
	}
	if (attendeeProfile.covidPass) {
		searchParams.append("covid_pass", "true");
	}
	if (attendeeProfile.ticketKey) {
		searchParams.append("ticket_key", attendeeProfile.ticketKey);
	}

	return `?${searchParams}`;
}

export function decode_url(queryParams: URLSearchParams): AttendeeProfile {
	let attendeeProfile: AttendeeProfile = {
		attendee: null,
		covidPass: false,
		ticketKey: null
	}

	// Attendee Info
	let attendee_id = parseInt(queryParams.get("attendee_id") || "");
	if (!isNaN(attendee_id)) {
		attendeeProfile.attendee = findAttendeeByID(get(allEventAttendees), attendee_id);
	}

	// Covid Pass Info
	attendeeProfile.covidPass = queryParams.has("covid_pass");

	// Ticket Eventlet Info
	let ticket_key = queryParams.get("ticket_key") || "";
	if (validate(ticket_key)) {
		attendeeProfile.ticketKey = ticket_key;
	}

	return attendeeProfile;
}
