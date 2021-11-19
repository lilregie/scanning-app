import { get } from "svelte/store";
import type { CheckIn } from "./attendee";
import { eventAttendees } from "./store";

export function eventNameFromReference(reference: string): string {
	return reference.split(' ').slice(1).join(' ');
}

export function newestCheckIns(): CheckIn[] {
	let attendees = get(eventAttendees);
	let check_ins: CheckIn[] = [];
	attendees.forEach((attendee)=>{
		check_ins.concat(attendee.check_ins)
	})
	return check_ins.sort((a, b)=>{ 
		return a.time.getTime() - b.time.getTime();
	})
}