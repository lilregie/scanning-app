import { derived, writable } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { Event } from '$lib/event';
import type { Attendee } from './attendee';
import { getAttendeesList } from './api';

let LOCAL_STORAGE_VERSION = 3;

/** Makes a store persistent in local storage
 * @param  {[Writable]} store Writable store to be made persistent
 * @param  {[string]} key Key to be used in Local Storage
 */
function useLocalStorage<T>(store: Writable<T>, key: string) {
	let localStorageKey = `lilregie_v${LOCAL_STORAGE_VERSION}_${key}`;
	if (typeof localStorage !== 'undefined') {
		const json = localStorage.getItem(localStorageKey);
		if (json) {
			store.set(JSON.parse(json));
		}

		store.subscribe((current) => {
			localStorage.setItem(localStorageKey, JSON.stringify(current));
		});
	}
}

export const chosenEventID: Writable<number> = writable(null);

export const allEvents: Writable<Event[]> = writable([]);
useLocalStorage(allEvents, 'allEvents');

export const chosenEvent = derived([chosenEventID, allEvents], ([_chosenEventID, _allEvents]) => {

	let potentialChosenEvent = _allEvents.filter((event) => event.id === _chosenEventID);
	if (potentialChosenEvent.length === 1) {
		console.log("Found event", _chosenEventID);

		// Also need to get people for new chosen event
		getAttendeesList();
		return potentialChosenEvent[0];
	} else {
		console.log("couldn't find event", _chosenEventID);
		return null;
	}
});

export const eventAttendees: Writable<Attendee[]> = writable([]);

export const attendeesSearchTerm: Writable<string> = writable('');

export const selectedAttendeeID: Writable<number> = writable(null);

export const selectedAttendee: Readable<Attendee> = derived([selectedAttendeeID, eventAttendees], ([_selectedAttendeeID, _eventAttendees]) => {
	let potentialSelectedAttendee = _eventAttendees.filter((attendee) => attendee.id === _selectedAttendeeID);
	if (potentialSelectedAttendee.length === 1) {
		return potentialSelectedAttendee[0];
	} else {
		return null;
	}
})

export const checkedInCount: Readable<number> = derived(eventAttendees, (_eventAttendees) => {
	return _eventAttendees.filter((attendee) => attendee.check_ins.length > 0).length;
});

export const prefersCameraOrTextScanning: Writable<string> = writable('camera');
useLocalStorage(prefersCameraOrTextScanning, 'prefersCameraOrTextScanning');