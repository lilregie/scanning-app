import { derived, get, writable } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { Eventlet, EventletsCombined, EventletSingle, LilRegieEvent } from '$lib/event';
import type { Attendee } from './attendee';
import { getAttendeesList } from './api/api';
import { findAttendeeByID } from './utill';

import type { StepManagerSettings } from './components/checkInSteps/stepManager';


const LOCAL_STORAGE_VERSION = 3;

/** Makes a store persistent in local storage
 * @param  {[Writable]} store Writable store to be made persistent
 * @param  {[string]} key Key to be used in Local Storage
 */
function useLocalStorage<T>(store: Writable<T>, key: string | (()=>string), defaultCallback: (() => void) | null = null): void {
	// It's a function, so the key can be regenerated each time it is saved
	const getLocalStorageKey = () => {
		let stringKey: string;
		if (typeof key === 'function') {
			stringKey = key();
		} else {
			stringKey = key;
		}
		return `lilregie_v${LOCAL_STORAGE_VERSION}_${stringKey}`;
	}
	if (typeof localStorage !== 'undefined') {
		const json = localStorage.getItem(getLocalStorageKey());
		if (json) {
			store.set(JSON.parse(json));
		} else if (defaultCallback) {
			defaultCallback();
		}

		store.subscribe((current) => {
			localStorage.setItem(getLocalStorageKey(), JSON.stringify(current));
		});
	}
}

export const currentEventID: Writable<number | null> = writable(null);

export const allEvents: Writable<LilRegieEvent[]> = writable([]);

export const currentEvent = derived([currentEventID, allEvents], ([_currentEventID, _allEvents]) => {
	if (_currentEventID !== null && _allEvents.length > 0) {
		const potentialcurrentEvent = _allEvents.filter((event) => event.id === _currentEventID);
		if (potentialcurrentEvent.length === 1) {
			console.log("Found event", _currentEventID);

			// Also need to get people for new chosen event
			getAttendeesList(_currentEventID.toString());
			return potentialcurrentEvent[0];
		} else {
			console.log("couldn't find event", _currentEventID, "reset chosen event");
			currentEventID.set(null);
			return null;
		}
	} else {
		console.log("No event chosen");
		return null
	}

});

export const selectedEventletIDs: Writable<number[]> = writable([]);
const selectedEventletIDsLoaded = false;

currentEvent.subscribe((currentEvent) => {
	if (!currentEvent) {
		return
	}
	let firstTimeSelectedEventlet = false;

	if (!selectedEventletIDsLoaded) {
		// We want to do funky stuff if this is the first time selecting an eventlet
		const selectedEventletIDKeyGen = ()=>{
			return `selectedAttendeeIDs${get(currentEventID)}`;
		}
		useLocalStorage(selectedEventletIDs, selectedEventletIDKeyGen, ()=>{firstTimeSelectedEventlet = true});

	}
	// If only one eventlet, we need to force it to be just that one eventlet
	// Because when it is standalone, we want to hide the eventlet UI
	if (currentEvent?.standalone && currentEvent?.eventlets.length === 1) {
		selectedEventletIDs.set([currentEvent.eventlets[0].id]);
	} else if (firstTimeSelectedEventlet) {
		// First time loading event, so default to all eventlets
		selectedEventletIDs.set(currentEvent?.eventlets.map((eventlet: EventletSingle) => eventlet.id) || []);
		firstTimeSelectedEventlet = false;
	}
})

export const selectedEventletCombo: Readable<EventletsCombined | null> = derived([selectedEventletIDs, currentEvent],([_selectedEventletIDs, _currentEvent]) => {
	if (!_currentEvent) {
		return null
	}
	const getDateSum = (list: Eventlet[], opp: (...args: number[])=>number) => {
		return new Date(
			opp(
				...list.map((eventlet) => eventlet.start_at.getTime())
				)
		)
	}

	const selectedEventlets: EventletSingle[] = _currentEvent.eventlets.filter((eventlet: EventletSingle) => _selectedEventletIDs.includes(eventlet.id));

	if (selectedEventlets.length > 0) {

		// Now we just sum up the eventlets
		const ticket_limit_enabled = selectedEventlets.every((eventlet) => eventlet.maximum_attendees);
		return {
			checked_in_count: selectedEventlets.reduce((acc, eventlet) => acc + eventlet.checked_in_count, 0),
			event_id: _currentEvent.id,
			
			start_at: getDateSum(selectedEventlets, Math.min),
			end_at: getDateSum(selectedEventlets, Math.max),
			name: selectedEventlets.map((eventlet) => eventlet.name),
			maximum_attendees: ticket_limit_enabled ? selectedEventlets.reduce((acc, eventlet) => acc + (eventlet.maximum_attendees as number), 0) : 0,
			total_attendee_count: selectedEventlets.reduce((acc, eventlet) => acc + eventlet.total_attendee_count, 0),
			id: selectedEventlets.map((eventlet) => eventlet.id),
		} as EventletsCombined;
	} else {
		return null
	}

});

export const allEventAttendees: Writable<Attendee[] | null> = writable(null);

export const eventletAttendees: Readable<Attendee[] | null> = derived([selectedEventletCombo, allEventAttendees], ([_selectedEventletCombo, _allEventAttendees]) => {
	if (_selectedEventletCombo && _allEventAttendees) {
		return _allEventAttendees.filter((attendee) => {
			const attendeeEventlets = attendee.attendances.map((eventlet) => eventlet.eventlet_id);
			if (_selectedEventletCombo.id) {
				// Check for array of eventlet ids intersection
				return _selectedEventletCombo.id.filter((id)=> (attendeeEventlets).includes(id)).length > 0;
			} else {
				// non-combo eventlet
				return attendeeEventlets.includes(_selectedEventletCombo.id);
			}
		});
	} else {
		console.log("No eventlet chosen",_selectedEventletCombo, _allEventAttendees);
		return null;
	}
})


export const attendeesSearchTerm: Writable<string> = writable('');

export const selectedAttendeeID: Writable<number | null> = writable(null);

export const selectedAttendee: Readable<Attendee | null> = derived(
	[selectedAttendeeID, eventletAttendees],
	([_selectedAttendeeID, _eventletAttendees]) => {
		if (_eventletAttendees && _selectedAttendeeID) {
			return findAttendeeByID(_eventletAttendees, _selectedAttendeeID)
		}
		return null
	}
);

export const checkedInCount: Readable<number> = derived(eventletAttendees, (_eventletAttendees) => {
	if (_eventletAttendees === null) {
		return 0;
	}
	return _eventletAttendees.filter((attendee) => attendee.checked_in_at !== null).length;
});

export const prefersCameraOrTextScanning: Writable<string> = writable('camera');
useLocalStorage(prefersCameraOrTextScanning, 'prefersCameraOrTextScanning');

export const globalModalState: Writable<any> = writable(null);


// Checked in screen might have check-in steps disabled or enabled
export const stepManagerSettings: Writable<StepManagerSettings> = writable({
	scanTicket: true,
	scanVaccinePass: true
});
useLocalStorage(stepManagerSettings, 'stepManagerSettings');