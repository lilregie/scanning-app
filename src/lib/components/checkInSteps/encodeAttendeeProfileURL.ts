import { allEventAttendees, currentEvent } from "$lib/store";
import { findAttendeeByID, findEventletByID } from "$lib/utill";
import { get } from "svelte/store";
import type { AttendeeProfile } from "./stepManager";

/*
    Query Param Spec

    ?attendee_id=<attendee_id>& // Attendee ID
    covid_pass& // Include if covid pass has been verified
    ticket_eventlet_id=<eventlet_id>& // Eventlet ID from ticket
    check_in_eventlet_id=<eventlet_id> // Eventlet ID to check into
*/ 

export async function encode_url(attendeeProfile: AttendeeProfile): Promise<string> {
    let searchParams = new URLSearchParams();

    if (attendeeProfile.attendee) {
        searchParams.append("attendee_id", attendeeProfile.attendee.id.toString());
    }
    if (attendeeProfile.covidPass) {
        searchParams.append("covid_pass", "true");
    }
    if (attendeeProfile.ticket_eventlet) {
        searchParams.append("ticket_eventlet_id", attendeeProfile.ticket_eventlet.id.toString());
    }
    if (attendeeProfile.check_in_eventlet) {
        searchParams.append("check_in_eventlet_id", attendeeProfile.check_in_eventlet.id.toString());
    }

    return `?${searchParams}`;
}

export async function decode_url(queryParams: URLSearchParams): Promise<AttendeeProfile> {
    let attendeeProfile: AttendeeProfile = {
        attendee: null,
		covidPass: false,
        ticket_eventlet: null,
        check_in_eventlet: null
    }

    // Attendee Info
    let attendee_id = parseInt(queryParams.get("attendee_id"));
    if (!isNaN(attendee_id)) {
        attendeeProfile.attendee = findAttendeeByID(get(allEventAttendees), attendee_id);
    }

    // Covid Pass Info
    attendeeProfile.covidPass = queryParams.has("covid_pass");

    // Ticket Eventlet Info
    let ticket_eventlet_id = parseInt(queryParams.get("check_in_eventlet_id"));
    if (!isNaN(ticket_eventlet_id)) {
        attendeeProfile.check_in_eventlet = findEventletByID(get(currentEvent), ticket_eventlet_id);
    }

    // Target Checkin Eventlet
    let checkin_eventlet_id = parseInt(queryParams.get("check_in_eventlet_id"));
    if (!isNaN(checkin_eventlet_id)) {
        attendeeProfile.check_in_eventlet = findEventletByID(get(currentEvent), checkin_eventlet_id);
    }

    return attendeeProfile;
}