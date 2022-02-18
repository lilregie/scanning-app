<script lang="ts">
	import Doughnut from 'svelte-chartjs/src/Doughnut.svelte';

	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import { newestCheckInsTable } from '$lib/generateDataVis';

	import { chosenEvent, chosenEventID, eventAttendees } from '$lib/store';
	import type { TableRow } from '$lib/components/Table.svelte';
	import { basePath } from '$lib/consts';

	let checkInTable: [string[], TableRow[]] = [[], []];
	eventAttendees.subscribe((_) => {
		checkInTable = newestCheckInsTable();
	});

	$: checkedIn = $eventAttendees.filter((e) => e.checked_in_at !== null).length;
	$: notCheckedIn = $eventAttendees.length - checkedIn;
	$: availableTickets = $chosenEvent?.['total_tickets'] - $eventAttendees.length;

	$: checkinChartData = {
		labels: ['Checked in', 'Not Checked in', 'Available'],
		datasets: [
			{
				label: 'Registrations',
				data: [checkedIn, notCheckedIn, availableTickets],
				backgroundColor: ['#2BA628', '#626262', 'rgba(255,255,255,0.08)'],
				hoverOffset: 20,
				borderWidth: 0,
				rotation: 90,
				borderRadius: 2,
				cutout: '120'
			}
		]
	};

	const chartOptions = {
		layout: {
			padding: 50
		},
		plugins: {
			legend: {
				display: false
			}
		}
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
		<Button href="{basePath}/{$chosenEventID}/edit" expanded>Next</Button>
	</div>
	<div slot="right-bar" class="graph-container">
		<Doughnut data={checkinChartData} options={chartOptions} />
		<div class="stats">
			<h2>{$eventAttendees.length} Registered</h2>
			<h3>{availableTickets || '??'} Available Tickets</h3>
		</div>
	</div>
</AdminLayout>

<style lang="scss">
	@use '../../lib/styles/vars.scss' as *;
	.latest-check-ins-container {
		position: relative;
	}
	.graph-container {
		display: flex;
		flex-direction: column;
		text-align: center;
		flex: 1;
		align-items: stretch;
		align-content: stretch;
		justify-content: center;
		width: 30em;
		max-width: 100%;
		margin: auto;
		color: white;
		.stats {
			h2,
			h3 {
				margin: 0;
			}
			h2 {
				font-size: 2.5em;
			}
			h3 {
				font-size: 1.4em;
				font-weight: normal;
			}
		}
	}
</style>
