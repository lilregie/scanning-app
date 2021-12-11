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

export function findByKey<T>(list: T[], key: string, value: any): T | undefined {
	return list.find((item) => item[key] === value);
}


/// Convert a string to title case, so it is "Like This".
export function titleCase(str) {
	let splitStr = str.toLowerCase().split(/[\s\-,_]+/);
	for (var i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
	}
	return splitStr.join(' '); 
 }
 