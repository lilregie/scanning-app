import type { Attendee } from "./attendee";
import normalizeStrings from "normalize-strings"

export function newestCheckIns(eventAttendees: Attendee[]): Attendee[] {
	let checkIns: Attendee[] = [];
	checkIns = eventAttendees.filter(attendee => attendee.checked_in_at !== null);
	checkIns = checkIns.sort((a: Attendee, b: Attendee) => {
		if (b.checked_in_at && a.checked_in_at) {
			return b.checked_in_at.getTime() - a.checked_in_at.getTime();
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

export function findAttendeeByID(attendees: Attendee[], id: string): Attendee | null {
	if (id === null) {
		return null
	}
	let potentialSelectedAttendee = attendees.filter((attendee) => attendee.id === id);
	if (potentialSelectedAttendee.length === 1) {
		return potentialSelectedAttendee[0];
	} else {
		return null;
	}
}

/// Convert a string to title case, so it is "Like This".
export function titleCase(str) {
	let splitStr = str.toLowerCase().split(/[\s\-,_]+/);
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
}