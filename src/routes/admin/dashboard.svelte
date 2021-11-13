<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import CheckInList from '$lib/components/CheckInList.svelte';

    import {generateLatestCheckIns} from "$lib/mocks/personMock"

    let peopleList = generateLatestCheckIns(5);
</script>

<AdminLayout>
	<div slot="left-bar" class="latest-check-ins-container">
        <!-- Check in list with example data for now -->
		<CheckInList bind:peopleList />
		<a class="next-button lr-button expanded" href="/admin/checkin">Next</a>
	</div>
	<div slot="right-bar" class="graph-container">
		<h2>g r a p h</h2>
		<div />
	</div>
</AdminLayout>

<style lang="scss">
	.latest-check-ins-container {
		position: relative;
		height: 100%;
		.next-button {
			position: absolute;
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
