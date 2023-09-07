<script lang="ts">
	import CheckinChart from "./CheckinChart.svelte";

	export let labels: string[] = []
	export let data: number[]
</script>

<div class="stats-container">
	<div class="chart-container">
		<CheckinChart {data} />
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

	h2 {
		margin: 0.5em 0;
	}

	.stats-container {
		display: flex;
		flex-direction: column;
		text-align: center;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-height: 100%;
		overflow: hidden;
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
		gap: 0.75em;
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
