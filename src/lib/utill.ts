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
		return b[0].time.getTime() - a[0].time.getTime();
	});
	return checkIns
}
export function normString(x: string): string {
	return normalizeStrings(x).toLowerCase().trim();
}
