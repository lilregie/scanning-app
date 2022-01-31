import type { Attendee, CheckIn } from "./attendee";
import normalizeStrings from "normalize-strings"

export function eventNameFromReference(reference: string): string {
	return reference.split(' ').slice(1).join(' ');
}

export function newestCheckIns(eventAttendees: Attendee[]): [CheckIn, Attendee][] {
	let checkIns: [CheckIn, Attendee][] = [];
	eventAttendees.forEach((attendee) => {
		checkIns = checkIns.concat(attendee.check_ins.map((check_in) => [check_in, attendee]))
	})
	checkIns = checkIns.sort((a, b) => {
		if (b[0].time && a[0]) {
			return b[0].time.getTime() - a[0].time.getTime();
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

export function findAttendeeByID(attendees: Attendee[], id: number): Attendee | null {
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