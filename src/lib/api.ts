import { generateEvent } from '$lib/mocks/eventMock';
import { get } from 'svelte/store';
import type { Event } from './event';
import { generateAttendeesForEvent } from './mocks/attendeeMock';
import { allEvents, eventAttendees } from './store';

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