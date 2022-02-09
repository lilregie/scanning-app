<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import CovidPassBadge from '$lib/components/CovidPassBadge.svelte';

	import type { TableRow } from '$lib/components/Table.svelte';
	import type { Attendee } from '$lib/attendee';

	import { findAttendeeByID, titleCase } from '$lib/utill';
	import { eventAttendees, selectedAttendeeID as globalSelectedAttendeeID } from '$lib/store';
	import { createCheckIn } from '$lib/api/api';

	import Fuse from 'fuse.js';
	import { getContext, onMount } from 'svelte';
	import { derived, get, Readable, Writable, writable } from 'svelte/store';
	import Button from '../Button.svelte';

	export let givenName: string;
	export let lastName: string;
	export let DOB: string;
	export let vaccineCert: string;

	const selectedAttendeeID: Writable<string> = writable(null);
	const selectedAttendee: Readable<Attendee> = derived(
		[selectedAttendeeID,eventAttendees],
		([id,attendees]) => findAttendeeByID(attendees, id)
	);

	let { close } = getContext('simple-modal');

	let matchingAttendees = [];

	let tableData: TableRow[] = [];

	let countMatchingExactly = 0;
	let countMatching = 0;

	// givenName usually also includes middle name, so we will remove that
	let firstName = givenName.split(' ')[0];

	const attendees_with_fullname = get(eventAttendees).map((attendee) => ({
		full_name: `${attendee.first_name} ${attendee.last_name}`,
		...attendee
	}));

	let fuse = new Fuse(attendees_with_fullname, {
		includeScore: true,
		keys: ['full_name'],
		threshold: 0.6,
		isCaseSensitive: false
	});
	matchingAttendees = fuse.search(`${firstName} ${lastName}`);
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

	function checkInAttendee() {
		let attendee = get(selectedAttendee);
		if (attendee) {
			createCheckIn(attendee, false, vaccineCert);
			globalSelectedAttendeeID.set(attendee.id)
			close();
		} else {
			console.log('No attendee selected, but somehow we are trying to check in someone');
		}
	}
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
		<CovidPassBadge name={titleCase(`${givenName} ${lastName}`)} dob={DOB} />
	</div>
</div>
{#if countMatching > 0}
	<Table tableHeaders={['Name', 'ID', 'Certainty', 'Checked In']} {tableData} />
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
	<div>
		<Button size="large" disabled={$selectedAttendee === null} on:click={checkInAttendee}>
			Check In attendee
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

	// Hide Certainty column on mobile, beacuse there isn't enough space
	@media (max-width: 768px) {
		:global(table td:nth-child(3)) {
			display: none;
		}
		:global(table th:nth-child(3)) {
			display: none;
		}
	}
</style>
