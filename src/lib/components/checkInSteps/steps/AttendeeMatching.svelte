<script lang="ts">

	import type { TableRow } from '$lib/components/Table.svelte';
	import type { Attendee } from '$lib/attendee';

	import type {Readable, Writable} from 'svelte/store';

	import Table from '$lib/components/Table.svelte';
	import CovidPassBadge from '$lib/components/CovidPassBadge.svelte';


	import { findAttendeeByID, titleCase } from '$lib/utill';
	import { eventletAttendees } from '$lib/store';

	import Fuse from 'fuse.js';
	import { derived, get, writable } from 'svelte/store';
	import Button from '../../Button.svelte';
import type { NZCovidPass } from '$lib/components/scanner/validateScan';


	export let vaccineCert: string;
	export let data: NZCovidPass;

	const selectedAttendeeID: Writable<number> = writable(null);
	const selectedAttendee: Readable<Attendee> = derived(
		[selectedAttendeeID,eventletAttendees],
		([id,attendees]) => findAttendeeByID(attendees, id)
	);


	let matchingAttendees = [];

	let tableData: TableRow[] = [];

	let countMatchingExactly = 0;
	let countMatching = 0;

	// givenName usually also includes middle name, so we will remove that
	let firstName = data.givenName.split(' ')[0];

	const attendees_with_fullname = get(eventletAttendees).map((attendee) => ({
		full_name: `${attendee.first_name} ${attendee.last_name}`,
		...attendee
	}));

	let fuse = new Fuse(attendees_with_fullname, {
		includeScore: true,
		keys: ['full_name'],
		threshold: 0.6,
		isCaseSensitive: false
	});
	matchingAttendees = fuse.search(`${firstName} ${data.lastName}`);
	if (matchingAttendees.length > 0) {
		selectedAttendeeID.set(matchingAttendees[0].item.id);
	}

	// Update Stats
	countMatching = matchingAttendees.length;
	countMatchingExactly = matchingAttendees.filter((attendee) => attendee.score <= 0.2).length;

	function generateTable() {
		tableData = matchingAttendees.map((fuseMatch) => {
			let attendee: Attendee = fuseMatch.item;
			let rowData: TableRow = {
				data: [
					titleCase(`${attendee.first_name} ${attendee.last_name}`),
					`#${attendee.id}`,
					`${((1 - fuseMatch.score) * 100).toFixed(2)}%`,
					attendee.checked_in_at !== null ? 'Checked In' : 'Not Checked In'
				],
				hightlighted: attendee.id === get(selectedAttendeeID),
				callback: () => {
					selectedAttendeeID.set(attendee.id);
				}
			};
			return rowData;
		});
	}
	selectedAttendee.subscribe(generateTable);
</script>

<div class="header">
	<div class="match-info">
		<h1>Find&NonBreakingSpace;Attendee</h1>
		{#if countMatching > 0}
			<p>
				This pass matched <b>{countMatchingExactly}</b> attendee exactly.<br />
				We’ve also found <b>{countMatching - countMatchingExactly}</b> other close matches in case of
				a typo.
			</p>
		{:else}
			<p>
				This pass didn’t match any attendees for this event.<br/>
				You can check in the attendee manually by searching for the attendee’s name,<br/> and using the Check In button in the Attendee Details panel.

			</p>
		{/if}
	</div>
	<div class="covid-pass-badge-wrapper">
		<CovidPassBadge {data} />
	</div>
</div>
{#if countMatching > 0}
<div class="attendee-matching-table-wrapper">
	<Table tableHeaders={['Name', 'ID', 'Certainty', 'Checked In']} {tableData} />
</div>
{/if}
<div class="action-container">
	<div>
		<Button size="large" color="secondary" on:click={close}>
			{#if countMatching > 0}
				View attendee details
			{:else}
				Search for Attendee
			{/if}
		</Button>
	</div>
</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
		flex-wrap: wrap;
		.covid-pass-badge-wrapper {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 1em;
			flex: 1;
		}
	}
	.action-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: row;
		padding: 0.5em;
		div {
			margin: 0.25em;
		}
	}

	// Hide Certainty column on mobile, because there isn't enough space
	@media (max-width: 768px) {
		:global(.attendee-matching-table-wrapper table td:nth-child(3)) {
			display: none;
		}
		:global(.attendee-matching-table-wrapper table th:nth-child(3)) {
			display: none;
		}
	}
</style>
