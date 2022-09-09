import { get } from "svelte/store";
import { currentEvent, eventletAttendees, selectedAttendeeID } from "./store";
import { newestCheckIns } from "./utill";
import Fuse from 'fuse.js';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)

import type { Attendee } from "./attendee";
import type { TableRow } from "$lib/components/Table.svelte";


export function newestCheckInsTable(): [string[], TableRow[]] {
	const includesNames = get(currentEvent)?.event_type === "registration";

	const tableHeaders = [...(includesNames ? ["Name"]: []), "ID", "Check In Time"];

	let attendees = get(eventletAttendees);

	if (attendees === null) {return [tableHeaders,[]]};

	const checkedInAttendees: Attendee[] = newestCheckIns(attendees);

	const tableData = checkedInAttendees.map(checkedInAttendee => {
		return {
			data: [
				...(includesNames ? [`${checkedInAttendee.first_name}  ${checkedInAttendee.last_name}`] : []),
				`#${checkedInAttendee.id}`,
				`${dayjs(checkedInAttendee.checked_in_at).from(new Date())}`
			]
		}
	});
	return [tableHeaders, tableData]
}

/// Generates an table of all the attendees, based off a search term
export function attendeesTable(attendees: Attendee[], searchTerm = ""): [string[], TableRow[]] {
	const event = get(currentEvent);
	const includesNames = event?.event_type === "registration";
	// Decides if we should show the vaccine pass column
	const includesVPInfo = event?.vaccine_pass_required;

	const tableHeaders = [...(includesNames ? ["Name"]: []), "ID", "Checked In", ...(includesVPInfo ? ["Vaccine Pass"] : [])];

	if (attendees === null) {return [tableHeaders,[]]};


	let sortedAttendees: Attendee[];
	if (searchTerm !== "") {
		const fuse = new Fuse(attendees, {
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
	const tableData: TableRow[] = sortedAttendees.map(attendee => {
		return {
			data: [
				...(includesNames ? [`${attendee.first_name}  ${attendee.last_name}`] : []),
				`#${attendee.id}`,
				!!attendee.checked_in_at,
				...(includesVPInfo ? [attendee.vaccine_pass] : [])
			],
			callback: () => {
				selectedAttendeeID.set(attendee.id);
				console.log(get(selectedAttendeeID))
			},
			hightlighted: attendee.id === get(selectedAttendeeID),
		}
	});

	return [tableHeaders, tableData]
}
