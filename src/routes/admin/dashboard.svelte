<script lang="ts">
	import Chart from 'svelte-frappe-charts';
	import { browser } from '$app/env';

	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import { newestCheckInsTable } from '$lib/generateDataVis';

	import { chosenEvent, eventAttendees } from '$lib/store';
	import type { TableRow } from '$lib/components/Table.svelte';

	let chartHeight;

	let checkInTable: [string[], TableRow[]] = [[], []];
	eventAttendees.subscribe((_) => {
		checkInTable = newestCheckInsTable();
	});

	$: checkedIn = $eventAttendees.filter((e) => e.check_ins.length > 0).length;
	$: notCheckedIn = $eventAttendees.length - checkedIn;
	$: availableTickets = $chosenEvent?.['total_tickets'] - $eventAttendees.length;

	$: checkinChartData = {
		labels: ['Available', 'Not Checked in', 'Checked in'],
		datasets: [
			{
				values: [availableTickets, notCheckedIn, checkedIn]
			}
		]
	};
</script>

<AdminLayout
	cards={{
		left: { scroll: true, highlighted: false },
		rightBottom: false,
		rightTop: false
	}}
>
	<div slot="left-bar" class="latest-check-ins-container">
		<!-- Check in list with example data for now -->
		<Table tableHeaders={checkInTable[0]} tableData={checkInTable[1]} />
	</div>
	<div slot="left-bar-footer">
		<Button href="/admin/checkin" size="expanded">Next</Button>
	</div>
	<div slot="right-bar" class="graph-container" bind:clientHeight={chartHeight}>
		<Chart
			data={checkinChartData}
			type="donut"
			colors={['#2BA628', '#626262', 'rgba(255,255,255,0.08)']}
			height="400"
		/>
	</div>
</AdminLayout>

<style lang="scss">
	@use '../../lib/styles/vars.scss' as *;
	.latest-check-ins-container {
		position: relative;
		.next-button {
			position: absolute;
			width: 100%;
			bottom: 0;
			text-decoration: none;
			box-sizing: border-box;
		}
	}
	.graph-container {
		display: flex;
		flex-direction: column;
		text-align: center;
		flex: 1;
		align-items: stretch;
		align-content: stretch;
		justify-content: center;
	}
</style>
