<script lang="ts" context="module">
	export async function load({ params, url }) {
		const { attendeeID } = params;
		return {
			props: {
				pathAttendeeID: parseInt(attendeeID) || null,
				url: url.pathname
			}
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
import Card from '$lib/components/Card.svelte';

	import StepManager from '$lib/components/checkInSteps/StepManager.svelte';
	import OuterRingLayout from '$lib/components/layouts/OuterRingLayout.svelte';
	import { basePath } from '$lib/consts';
	import {
		currentEventID,
		eventletAttendees,
		selectedAttendee,
		selectedAttendeeID
	} from '$lib/store';
import { onMount } from 'svelte';

	export let pathAttendeeID: number;
	export let url: string;

	const backPath = `${basePath}/${$currentEventID}/edit`;

	onMount(async ()=>{
		$selectedAttendeeID = pathAttendeeID;

		if ($selectedAttendeeID === null) {
			goto(backPath);
		}
	})

	function onClose() {
		goto(backPath);
	}

</script>

<OuterRingLayout {backPath} {url}>
	<div class="container">
		<Card expand allowClosing on:close={onClose}>
			{#if $eventletAttendees}
				<StepManager attendee={selectedAttendee} />
			{/if}
		</Card>
	</div>
</OuterRingLayout>

<style lang="scss">
	.container {
		height: 100%;
	}
</style>