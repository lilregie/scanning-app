<script lang="ts">
	import { selectedEventletCombo, eventletAttendees } from '$lib/store';
	import { Pie } from 'svelte-chartjs';
	import type { ChartOptions } from 'chart.js';
	import { Circle } from 'svelte-loading-spinners';
	import { fade } from 'svelte/transition';
	import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
  } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	export let labels: string[] = []
	export let data: number[]

	let checkinChartData: any;

	$: checkinChartData = {
		labels,
		datasets: [
			{
				data,
				backgroundColor: ['#2BA628', '#000000', 'rgba(255,255,255,0.08)'],
				hoverOffset: 20,
				borderWidth: 0,
				borderRadius: 2
			}
		]
	};

	const chartOptions: ChartOptions = {
		events: [], // deactivate toggling datasets and showing count badges
		plugins: {
			legend: {
				display: false,
			},
			title: {
        display: false,
      }
		},
		responsive: true
	};
</script>

<div class="stats-container">
	<div class="chart-container">
		<Pie data={checkinChartData} options={chartOptions} />
	</div>
	<h2>Total Check-ins</h2>
	<dl class="checkin-stats">
		<div class="checkin-stat isCheckinIn">
			<dt>{labels[0]}</dt>
			<dd>{data[0]}</dd>
		</div>
		<div class="checkin-stat">
			<dt>{labels[1]}</dt>
			<dd>{data[1]}</dd>
		</div>
	</dl>
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.stats-container {
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-height: 100%;
		overflow: hidden;

		.graph-wrapper {
			max-width: 35vh;
			width: 30em;
		}
	}

	.chart-container {
		display: flex;
		justify-content: center;
		max-height: 196px;
		max-width: 196px;
	}

	.checkin-stats {
		display: flex;
		flex-direction: column;
		gap: 1em;
		margin: 0;
	}

	.checkin-stat {
		display: flex;
		flex-direction: row-reverse;
		gap: 0.4em;
		justify-content: center;

		&.isCheckinIn {
			color: #3DC393;
		}

		dd {
			font: {
				weight: bold;
			}
			margin: 0;
		}
	}
</style>
