import { derived, get, writable } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { Eventlet, EventletsCombined, EventletSingle, EventDetails } from '$lib/event';
import type { Attendee, EventletAttendance } from './attendee';
import { getAttendeesList } from './api/api';
import { findAttendeeByID } from './utill';

import type { StepManagerSettings } from './components/checkInSteps/stepManager';
import type { Booking } from './booking';


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

export const allEvents: Writable<EventDetails[]> = writable([]);

export const currentEvent = derived([currentEventID, allEvents], ([$currentEventID, $allEvents]) => {
	if ($currentEventID !== null && $allEvents.length > 0) {
		const potentialcurrentEvent = $allEvents.filter((event) => event.id === $currentEventID);

		if (potentialcurrentEvent.length === 1) {
			// Also need to get people for new chosen event
			getAttendeesList($currentEventID.toString());

			return potentialcurrentEvent[0];
		} else {
			console.log("couldn't find event", $currentEventID, "reset chosen event");
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
export const selectedEventletId: Writable<number | null> = writable(null)

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

export const qParam: Writable<string> = writable('')
export const checkinStatusParam: Writable<string> = writable('')

function filterAttendees(attendees: Attendee[], q: string): Attendee[] {
	if (q.trim().length == 0) return attendees;

	const terms = q.split(' ').filter(s => s !== '').map(s => s.toLowerCase().normalize("NFKD"))
	const names = terms.filter(t => /[\p{L}-]+/u.test(t))
	const numbers = terms.filter(t => /\d+/.test(t))

	return attendees.filter(attendee => {
		const id = attendee.booking_id.toString()
		const isIdMatch = (n: string) => isMatch(id, n)
		const isNameMatch = (s: string) => {
			return isMatch(attendee.first_name, s) || isMatch(attendee.last_name, s)
		}

		if (numbers.length > 0 && names.length > 0) {
			return numbers.some(isIdMatch) && (names.every(isNameMatch) || numbers.some(isNameMatch))
		} else {
			return numbers.some(isIdMatch) || terms.every(isNameMatch)
		}
	})
}

function isMatch(string: string, term: string): boolean {
	return string.toLowerCase().normalize("NFKD").indexOf(term) > -1;
}

function filterByEventlet(attendances: EventletAttendance[], eventlet: string): EventletAttendance[] {
	if (eventlet === '') return attendances;

	return attendances.filter(a => a.eventlet_id === Number.parseInt(eventlet));
}

function filterByCheckinStatus(attendances: EventletAttendance[], checkinStatus: string): EventletAttendance[] {
	if (checkinStatus === '') return attendances;

	const predicate = { "false": false, "true": true }[checkinStatus]

	return attendances.filter(a => !!a.checked_in_at === predicate);
}

function filterAttendances(attendances: EventletAttendance[], eventlet: string, checkinStatus: string): EventletAttendance[] {
	return [
		(attendances: EventletAttendance[]) => filterByEventlet(attendances, eventlet),
		(attendances: EventletAttendance[]) => filterByCheckinStatus(attendances, checkinStatus)
	].reduce((accumulator, f) => f(accumulator), attendances)
}

function attendeeSorter<T extends { first_name: string, last_name: string }>(a: T, b: T) {
	const firstNameRank = a.first_name.toLocaleLowerCase().localeCompare(b.first_name.toLocaleLowerCase())

	if (firstNameRank === 0) {
		// order by last name
		return a.last_name.toLocaleLowerCase().localeCompare(b.last_name.toLocaleLowerCase())
	} else {
		return firstNameRank;
	}
}

function attendanceSorter<T extends { eventlet_name: string }>(a: T, b: T) {
	return a.eventlet_name.localeCompare(b.eventlet_name)
}

export const filteredAttendees: Readable<Attendee[]> = derived([allEventAttendees, qParam, selectedEventletId, checkinStatusParam], ([$attendees, $q, $selectedEventletId, $checkinStatus]) => {
	if ($attendees === null) return [];
	// if ($q.trim().length == 0) return $attendees;

	return filterAttendees($attendees, $q).sort(attendeeSorter).map(attendee => {
		return {
			...attendee,
			attendances: filterAttendances(
				attendee.attendances,
				($selectedEventletId?.toString() ?? ''),
				$checkinStatus
			).sort(attendanceSorter)
		}
	})
})

export const bookings: Writable<Booking[]> = writable([]);
const nonEmptyString = (s: string | null | undefined): s is string => {
	return typeof s === 'string' && s.trim() !== ''
}

function filterBookings(bookings: Booking[], q: string): Booking[] {
	if (q.trim().length == 0) return bookings;

	const terms = q.split(' ').filter(s => s !== '').map(s => s.toLowerCase().normalize("NFKD"))
	const names = terms.filter(t => /[\p{L}-]+/u.test(t))
	const numbers = terms.filter(t => /\d+/.test(t))

	return bookings.filter(booking => {
		const id = booking.id.toString()
		const isIdMatch = (n: string) => isMatch(id, n)
		const isNameMatch = (s: string) => {
			const names = [booking.billing_first_name, booking.billing_last_name].filter(nonEmptyString)

			return names.some(name => isMatch(name, s))
		}

		if (numbers.length > 0 && names.length > 0) {
			return numbers.some(isIdMatch) && (names.every(isNameMatch) || numbers.some(isNameMatch))
		} else {
			return numbers.some(isIdMatch) || terms.every(isNameMatch)
		}
	})
}

export const filteredBookings: Readable<Booking[]> = derived(
	[bookings, qParam, selectedEventletId, checkinStatusParam],
	([$bookings, $q, $selectedEventletId, $checkinStatus]) => {
		const result = $bookings.map(booking => {
			return {
				...booking,
				attendees: booking.attendees.map(attendee => {
					return {
						...attendee,
						attendances: filterAttendances(
							attendee.attendances,
							($selectedEventletId?.toString() ?? ''),
							$checkinStatus
						)
					}
				})
			}
		}).filter(booking => {
			// remove if no attendances are left after filtering those
			if (booking.attendees.every(attendee => attendee.attendances[0] === undefined)) {
				return false
			}

			return true
		})

		return filterBookings(result, $q)
	}
)

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

export const globalModalState: Writable<any> = writable(null);


// Checked in screen might have check-in steps disabled or enabled
export const stepManagerSettings: Writable<StepManagerSettings> = writable({
	scanTicket: true,
	scanVaccinePass: true
});
useLocalStorage(stepManagerSettings, 'stepManagerSettings');
