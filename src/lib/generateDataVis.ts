import { get } from "svelte/store";
import { eventAttendees, selectedAttendeeID } from "./store";
import { newestCheckIns } from "./utill";


import { formatDistance } from "date-fns";
import type { Attendee } from "./attendee";


interface TableRow {
	data: string[];
	callback?: () => void;
}

export function newestCheckInsTable(): [string[], TableRow[]]  {
	let checkIns = newestCheckIns(get(eventAttendees));
	let tableHeaders = ["Name", "ID", "Check In Time"];
	let tableData = checkIns.map(check_in => {return{ data: [
		`${check_in[1].first_name}  ${check_in[1].last_name}`,
		`#${check_in[1].id}`,
		`${formatDistance(check_in[0].time, new Date(), { addSuffix: true })}`
	]}});
	return [tableHeaders, tableData]
}

export function attendeesTable(attendees: Attendee[]): [string[], TableRow[]] {
	let tableHeaders = ["Name", "ID", "Checked In"];
	let tableData: TableRow[] = attendees.map(attendee => {
		return {
			data: [
				`${attendee.first_name}  ${attendee.last_name}`,
				`#${attendee.id}`,
				// TODO: doesn't take account of multi-day events, or allow for icons
				`${attendee.check_ins.length > 0 ? "Checked In" : "Not Checked In"}`
			],
			callback: () => {
				console.log("Selected: ", attendee);
				selectedAttendeeID.set(attendee.id);
			}
		}
	});
	console.log("table", attendees.length)
	return [tableHeaders, tableData]

}