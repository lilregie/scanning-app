import { derived, get, writable } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { Eventlet, LilRegieEvent } from '$lib/event';
import type { Attendee } from './attendee';
import { getAttendeesList } from './api/api';
import { findAttendeeByID } from './utill';
import { goto } from '$app/navigation';
import { browser } from '$app/env';
import { basePath } from './consts';


let LOCAL_STORAGE_VERSION = 3;

/** Makes a store persistent in local storage
 * @param  {[Writable]} store Writable store to be made persistent
 * @param  {[string]} key Key to be used in Local Storage
 */
function useLocalStorage<T>(store: Writable<T>, key: string | (()=>string), defaultCallback: () => void = null): void {
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

export const currentEventID: Writable<number> = writable(null);

export const allEvents: Writable<LilRegieEvent[]> = writable([]);

export const currentEvent = derived([currentEventID, allEvents], ([_currentEventID, _allEvents]) => {
	if (_currentEventID !== null && _allEvents.length > 0) {
		let potentialcurrentEvent = _allEvents.filter((event) => event.id === _currentEventID);
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
let selectedEventletIDsLoaded = false;

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
		selectedEventletIDs.set(currentEvent?.eventlets.map((eventlet) => eventlet.id) || []);
		firstTimeSelectedEventlet = false;
	}
})

export const selectedEventletCombo: Readable<Eventlet> = derived([selectedEventletIDs, currentEvent],([_selectedEventletIDs, _currentEvent]) => {
	if (!_currentEvent) {
		return null
	}
	const getDateSum = (list: Eventlet[], opp: (...args: number[])=>number) => {
		return new Date(
			opp(
				...list.map((eventlet) => eventlet.datetime_start.getTime())
				)
		)
	}

	let selectedEventlets = _currentEvent.eventlets.filter((eventlet) => _selectedEventletIDs.includes(eventlet.id));

	if (selectedEventlets.length > 0) {

		// Now we just sum up the eventlets
		const ticket_limit_enabled = selectedEventlets.every((eventlet) => eventlet.ticket_limit);
		return {
			checked_in_count: selectedEventlets.reduce((acc, eventlet) => acc + eventlet.checked_in_count, 0),
			datetime_start: getDateSum(selectedEventlets, Math.min),
			datetime_end: getDateSum(selectedEventlets, Math.max),
			id: null,
			name: selectedEventlets.map((eventlet) => eventlet.name).join(", "),
			ticket_limit: ticket_limit_enabled ? selectedEventlets.reduce((acc, eventlet) => acc + eventlet.ticket_limit, 0) : 0,
			total_ticket_count: selectedEventlets.reduce((acc, eventlet) => acc + eventlet.total_ticket_count, 0),
			combo_ids: selectedEventlets.map((eventlet) => eventlet.id)
		} as Eventlet;
	} else {
		return {
			checked_in_count: 0,
			datetime_start: null,
			datetime_end: null,
			id: null,
			name: "",
			ticket_limit: null,
			total_ticket_count: 0,
			combo_ids: []
		}
	}

});

export const allEventAttendees: Writable<Attendee[] | null> = writable(null);
// we want to hide this attendeeList, to force the use of evenletAttndees

export const eventletAttendees: Readable<Attendee[] | null> = derived([selectedEventletCombo, allEventAttendees], ([_selectedEventletCombo, _allEventAttendees]) => {
	if (_selectedEventletCombo && _allEventAttendees) {
		return _allEventAttendees.filter((attendee) => {
			let attendeeEventlets = attendee.attendances.map((eventlet) => eventlet.eventlet_id);
			if (_selectedEventletCombo.combo_ids) {
				// Check for array of eventlet ids intersection
				return _selectedEventletCombo.combo_ids.filter((id)=> (attendeeEventlets).includes(id)).length > 0;
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

export const selectedAttendeeID: Writable<number> = writable(null);

export const selectedAttendee: Readable<Attendee> = derived(
	[selectedAttendeeID, eventletAttendees],
	([_selectedAttendeeID, _eventletAttendees]) => findAttendeeByID(_eventletAttendees, _selectedAttendeeID)
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
