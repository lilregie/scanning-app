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
	import AttendeeDetails from '$lib/components/AttendeeDetails.svelte';
	import Card from '$lib/components/Card.svelte';

	import StepManager from '$lib/components/checkInSteps/StepManager.svelte';
	import AdminLayout from '$lib/components/layouts/AdminLayout.svelte';
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

	onMount(async () => {
		$selectedAttendeeID = pathAttendeeID;

		if ($selectedAttendeeID === null) {
			goto(backPath);
		}
	});

	function onClose() {
		goto(backPath);
	}
</script>

<AdminLayout {backPath} {url}>
	<div slot="right-bar" class="container">
		<Card expand allowClosing on:close={onClose}>
			{#if $eventletAttendees}
				<StepManager attendee={selectedAttendee} on:close={onClose}/>
			{/if}
		</Card>
	</div>

	<div class="attendee-details" slot="left-bar">
		<AttendeeDetails attendee={selectedAttendee} actionsAvailable={false} direction={'vertical'} />
	</div>
</AdminLayout>

<style lang="scss">
	.container {
		height: 100%;
	}
</style>
