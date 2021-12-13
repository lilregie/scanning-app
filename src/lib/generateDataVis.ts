import { get } from "svelte/store";
import { eventAttendees, selectedAttendeeID } from "./store";
import { newestCheckIns } from "./utill";
import Fuse from 'fuse.js';


import { formatDistance } from "date-fns";

import type { Attendee } from "./attendee";
import type { TableRow } from "$lib/components/Table.svelte";


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

/// Generates an table of all the attendees, based off a search term
export function attendeesTable(attendees: Attendee[], searchTerm: string = ""): [string[], TableRow[]] {
	let tableHeaders = ["Name", "ID", "Checked In"];
	let sortedAttendees: Attendee[];
	if (searchTerm!=="") {
		let fuse = new Fuse(attendees, {
			includeScore: true,
			keys: [{
				name: "first_name",
				weight: 3,
			}, "last_name", "id"],
			threshold: 0.3,
		});
		sortedAttendees = fuse.search(searchTerm).map(result => result.item);
	} else {
		sortedAttendees = attendees;
	}
	let tableData: TableRow[] = sortedAttendees.map(attendee => {
		return {
			data: [
				`${attendee.first_name}  ${attendee.last_name}`,
				`#${attendee.id}`,
				// TODO: doesn't take account of multi-day events, or allow for icons
				`${attendee.check_ins.length > 0 ? "Checked In" : "Not Checked In"}`
			],
			callback: () => {
				selectedAttendeeID.set(attendee.id);
			},
			hightlighted: attendee.id === get(selectedAttendeeID),
		}
	});

	return [tableHeaders, tableData]
}