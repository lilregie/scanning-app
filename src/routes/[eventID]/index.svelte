<script lang="ts">
	import Doughnut from 'svelte-chartjs/src/Doughnut.svelte';
	import { Circle } from 'svelte-loading-spinners';

	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import { newestCheckInsTable } from '$lib/generateDataVis';

	import { currentEvent, currentEventID, eventletAttendees } from '$lib/store';
	import type { TableRow } from '$lib/components/Table.svelte';
	import { basePath } from '$lib/consts';
	import EventletManager from '$lib/components/EventletManager.svelte';
import StatsView from '$lib/components/StatsView.svelte';

	let checkInTable: [string[], TableRow[]] = [[], []];
	eventletAttendees.subscribe((_) => {
		checkInTable = newestCheckInsTable();
	});

	$: displayEvenetletManager = $currentEvent?.stand_alone;
</script>

<AdminLayout
	cards={{
		left: { scroll: true, highlighted: false },
		rightBottom: false,
		rightTop: false
	}}
>
	<div slot="left-bar" class="latest-check-ins-container">
		<h2>Latest Check-Ins</h2>
		{#if $eventletAttendees !== null}
			<div class="table-wrapper">
				<Table tableHeaders={checkInTable[0]} tableData={checkInTable[1]}/>
			</div>
		{:else}
			<div class="loading-spinner">
				<Circle color="grey" size="5" unit="em" />
			</div>
		{/if}
	</div>
	<div slot="left-bar-footer">
		<Button href="{basePath}/{$currentEventID}/edit" expanded>Next</Button>
	</div>

	<div slot="info-panel" class="info-panel">
		<EventletManager/>
	</div>

	<div slot="list-panel" class="stats-view">
		<StatsView/>
	</div>

</AdminLayout>

<style lang="scss">
	@use '../../lib/styles/vars.scss' as *;
	.info-panel {
		color: $text-dark;
	}
	.latest-check-ins-container {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		.table-wrapper {
			flex-grow: 1;
			overflow: auto;
		}

		h2 {
			text-align: center;
		}
	}
	.loading-spinner {
		flex-grow: 1;
		align-self: center;
		display: flex;
		align-items: center;
	}
</style>
