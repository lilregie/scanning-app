<script lang="ts">

	import Table from '$lib/components/Table.svelte';
	import CovidPassBadge from '$lib/components/CovidPassBadge.svelte';

	import type { TableRow } from '$lib/components/Table.svelte';
	import type { Attendee } from '$lib/attendee';

	import { titleCase } from '$lib/utill';
	import { eventAttendees } from '$lib/store';


	import Fuse from 'fuse.js';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
import Card from '../Card.svelte';
import Button from '../Button.svelte';

	export let givenName: string;
	export let lastName: string;
	export let DOB: string;

	let matchingAttendees = [];

	let tableData: TableRow[] = [];

	onMount(() => {
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
			caseSensitive: false
		});
		matchingAttendees = fuse.search(`${firstName} ${lastName}`);
		
		let firstRow = true;
		tableData = matchingAttendees.map((fuseMatch) => {
			let attendee: Attendee = fuseMatch.item;
			let rowData: TableRow = {
				data: [
					titleCase(`${attendee.first_name} ${attendee.last_name}`),
					`#${attendee.id}`,
					`${((1 - fuseMatch.score) * 100).toFixed(2)}%`,
					attendee.check_ins.length > 0 ? "Checked In" : "Not Checked In",
				],
				hightlighted: firstRow
			};
			firstRow = false;
			return rowData;

		});
	});
</script>

<div class="header">
	<div class="match-info">
		<h1>Find&NonBreakingSpace;Attendee</h1>
		<p>
			This pass matched <b>1</b> attendee exactly.<br/>
			We’ve also found <b>{tableData.length-1}</b> other close matches in case of a typo.
		</p>
	</div>
	<div class="covid-pass-badge-wrapper">
		<CovidPassBadge name={titleCase(`${givenName} ${lastName}`)} dob={DOB}/>

	</div>
</div>
<Table tableHeaders={['Name', 'ID', 'Certainty', "Checked In"]} {tableData} />
<div class="action-container">
	<Button size="large" color="secondary">View attendee details</Button>
	<Button size="large">Check In attendee</Button>

</div>

<style lang="scss">
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-direction: row;
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
		justify-content: space-evenly;
		align-items: center;
		flex-direction: row;
		padding: 1em;
	}
</style>