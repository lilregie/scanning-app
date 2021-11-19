import { derived, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Event } from '$lib/event';
import type { Attendee } from './attendee';
import { getAttendeesList } from './api';

/** Makes a store persistent in local storage
 * @param  {[Writable]} store Writable store to be made persistent
 * @param  {[string]} key Key to be used in Local Storage
 */
function useLocalStorage<T>(store: Writable<T>, key: string) {
	if (typeof localStorage !== 'undefined') {
		const json = localStorage.getItem(key);
		if (json) {
			store.set(JSON.parse(json));
		}

		store.subscribe((current) => {
			localStorage.setItem(key, JSON.stringify(current));
		});
	}
}

export const chosenEventID = writable(-1);
useLocalStorage(chosenEventID, 'chosenEventID');

export const allEvents: Writable<Event[]> = writable([]);
// Stored just for testing while we have mock data, otherwise everything would change every load
useLocalStorage(allEvents, 'allEvents');

export const chosenEvent = derived([chosenEventID, allEvents], ([$chosenEventID, $allEvents]) => {
	let potentialChosenEvent = $allEvents.filter((event) => event.id === $chosenEventID);
	if (potentialChosenEvent.length === 1) {
		// Also need to get people for new chosen event
		getAttendeesList();
		return potentialChosenEvent[0];
	} else {
		console.log("couldn't find event", $chosenEventID);
		return null;
	}
});

export const eventAttendees: Writable<Attendee[]> = writable([]);
// Stored just for testing while we have mock data, otherwise everything would change every load
useLocalStorage(eventAttendees, 'eventAttendees');