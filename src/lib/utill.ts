import type { Attendee } from "./attendee";
import normalizeStrings from "normalize-strings"
import type { Eventlet, LilRegieEvent } from "./event";

export function newestCheckIns(eventAttendees: Attendee[]): Attendee[] {
	let checkIns: Attendee[] = [];
	checkIns = eventAttendees.filter(attendee => attendee.checked_in_at !== null);
	checkIns = checkIns.sort((a: Attendee, b: Attendee) => {
		if (b.checked_in_at && a.checked_in_at) {
			return b.checked_in_at.getTime() - a.checked_in_at.getTime();
		} else {
			return Number.MAX_VALUE
		}
	});
	return checkIns
}

export function normString(x: string): string {
	return normalizeStrings(x).toLowerCase().trim();
}

export function findByKey<T>(list: T[], key: string, value: any): T | undefined {
	return list.find((item) => item[key] === value);
}

export function findAttendeeByID(attendees: Attendee[] | null, id: number | null): Attendee | null {
	if (id === null || attendees === null) {
		return null
	}
	let potentialSelectedAttendee = attendees.filter((attendee) => attendee.id === id);
	if (potentialSelectedAttendee.length === 1) {
		return potentialSelectedAttendee[0];
	} else {
		return null;
	}
}

export function findEventletByID(currentEvent: LilRegieEvent, id: number): Eventlet | null {
	if (id === null || currentEvent === null) {
		return null
	}

	return currentEvent.eventlets.find(
		(eventlet) => eventlet.id === id
	) || null;
}


/// Convert a string to title case, so it is "Like This".
export function titleCase(str: string) {
	let splitStr = str.toLowerCase().split(/[\s\-,_]+/);
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
}


function isObject(item: any) {
	return (item && typeof item === 'object' && !Array.isArray(item));
}

export function mergeDeep(target: any, ...sources: any): object {
	if (!sources.length) return target;
	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				mergeDeep(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return mergeDeep(target, ...sources);
}
