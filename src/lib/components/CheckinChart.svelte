<script lang="ts">
	import { Pie } from 'svelte-chartjs';
	import type { ChartOptions } from 'chart.js';
	import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
  } from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	export let data: number[]

	let checkinChartData: any;
	$: checkinChartData = {
		datasets: [
			{
				data,
				backgroundColor: ['#2BA628', '#000000'],
				borderWidth: 0,
				borderRadius: 2
			}
		]
	};

	const chartOptions: ChartOptions = {
		events: [], // deactivate toggling datasets and showing count badges
		plugins: {
			legend: {
				display: false
			},
			title: {
        display: false,
      }
		}
	};
</script>

<Pie data={checkinChartData} options={chartOptions} />
