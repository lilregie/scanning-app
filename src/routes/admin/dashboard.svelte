<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import { newestCheckInsTable } from '$lib/generateDataVis';

	import { chosenEvent, eventAttendees } from '$lib/store';
	import { get } from 'svelte/store';
	

	let checkInTable: [string[],string[][]] = [[],[]];
	eventAttendees.subscribe((_)=>{
		checkInTable = newestCheckInsTable();
	})

	chosenEvent.subscribe((event) => console.log('Chosen Event', event));
</script>

<AdminLayout>
	<div slot="left-bar" class="latest-check-ins-container">
		<!-- Check in list with example data for now -->
		<Table tableHeaders={checkInTable[0]} tableData={checkInTable[1]} />
	</div>
	<div slot="left-bar-footer">
		<Button href="/admin/checkin" size="expanded">Next</Button>
	</div>
	<div slot="right-bar" class="graph-container">
		<h2>g r a p h</h2>
		<div />
	</div>
</AdminLayout>

<style lang="scss">
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
		align-items: center;
		justify-content: center;
		text-align: center;
		flex: 1;
		color: $text-dark;
		div {
			background-color: green;
			border-radius: 50%;
			padding: 2em;
			width: 100px;
			height: 100px;
		}
	}
</style>
