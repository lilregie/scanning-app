<script lang="ts">
	import { selectedEventletCombo, eventletAttendees } from '$lib/store';
	import Doughnut from 'svelte-chartjs/src/Doughnut.svelte';
	import type { ChartOptions } from 'chart.js';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';

	let chartWidth: number;
	let chartHeight: number;
	$: test = (() => {
		console.log(chartWidth, chartHeight);
	})();
	console.log(test);

	$: checkedIn = $eventletAttendees?.filter((e) => e.checked_in_at !== null).length;
	$: notCheckedIn = $eventletAttendees?.length - checkedIn;
	$: availableTickets = $selectedEventletCombo?.ticket_limit
		? $selectedEventletCombo?.ticket_limit - $eventletAttendees?.length
		: null;

	$: checkinChartData = {
		labels: ['Checked in', 'Not Checked in', availableTickets ? 'Available' : null].filter(
			(e) => e
		),
		datasets: [
			{
				label: 'Registrations',
				data: [checkedIn, notCheckedIn, availableTickets],
				backgroundColor: ['#2BA628', '#626262', 'rgba(255,255,255,0.08)'],
				hoverOffset: 20,
				borderWidth: 0,
				rotation: 90,
				borderRadius: 2,
				cutout: chartHeight > 400 && chartWidth > 1100 ? '120' : '30%'
			}
		]
	};

	const chartOptions: ChartOptions = {
		layout: {
			padding: chartHeight > 500 && chartWidth > 1200 ? 50 : 20
		},
		plugins: {
			legend: {
				display: true,
				position: 'bottom'
			}
		},
		responsive: true
	};

	$: showGraph = $eventletAttendees?.length > 0 && chartWidth > 850;
</script>

<div class="stats-container" bind:clientWidth={chartWidth} bind:clientHeight={chartHeight}>
	{#if $eventletAttendees !== null}
		<div class="stats">
			<h2>{$eventletAttendees?.length} Registrations</h2>
			{#if availableTickets}
				<h3>{availableTickets} Available Tickets</h3>
			{/if}
			<h3>{checkedIn} Checked In</h3>
		</div>
		{#if showGraph}
			<div class="graph-wrapper" transition:fade|local>
				<Doughnut data={checkinChartData} options={chartOptions} />
			</div>
		{/if}
	{:else}
		<div class="loading-spinner">
			<Circle color="grey" size="5" unit="em" />
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;
	.stats-container {
		display: flex;
		flex-direction: row;
		text-align: center;
		justify-content: center;
		align-items: center;
		width: 100%;
		color: $text-dark;
		max-height: 100%;
		overflow: hidden;
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
		.graph-wrapper {
			max-width: 35vh;
			width: 30em;
		}
	}
</style>
