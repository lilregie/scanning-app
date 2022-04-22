<script lang="ts" context="module">
	export async function load({ url }) {
		return {
			props: {
				url: url.pathname
			}
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
allEventAttendees,
currentEvent,
		currentEventID,
		eventletAttendees,
		globalModalState,
		selectedAttendee,
		selectedAttendeeID
	} from '$lib/store';
	import { onMount } from 'svelte';

	import { basePath } from '$lib/consts';
	
	import Card from '$lib/components/Card.svelte';
	import StepManager from '$lib/components/checkInSteps/StepManager.svelte';
	import AdminLayout from '$lib/components/layouts/AdminLayout.svelte';
	import AttendeeDetails from '$lib/components/AttendeeDetails.svelte';
	import { decode_url } from '$lib/components/checkInSteps/encodeAttendeeProfileURL';
	import { derived, writable, type Readable, type Writable } from 'svelte/store';
	import type { AttendeeProfile } from '$lib/components/checkInSteps/stepManager';

	export let url: string;

	const backPath = `${basePath}/${$currentEventID}/edit`;
	
	const bootstrapAttendeeProfile: Readable<AttendeeProfile> = derived([page, allEventAttendees],([_page,_allEventAttendees], set)=>{
		if (!_allEventAttendees) {
			set(null);
			return;
		}
		decode_url(_page.url.searchParams).then((newAttendeeProfile)=>set(newAttendeeProfile));
	});

	const attendeeProfile: Writable<AttendeeProfile> = writable(null);
	$: attendeeProfile.set($bootstrapAttendeeProfile);

	function onClose() {
		goto(backPath);
	}

	onMount(()=>{
		globalModalState.set(null);
	});
</script>

<AdminLayout {backPath} {url}>
	<div slot="right-bar" class="container">
		<Card expand allowClosing on:close={onClose}>
			{#if $bootstrapAttendeeProfile}
				<StepManager {attendeeProfile} on:close={onClose}/>
			{:else}
				Loading animation here...
			{/if}
		</Card>
	</div>

	<div class="attendee-details" slot="left-bar">
		{#if $selectedAttendee}
			<AttendeeDetails attendee={selectedAttendee} actionsAvailable={false} direction={'vertical'} />
		{:else}
			No attendee selected...
		{/if}
	</div>
</AdminLayout>

<style lang="scss">
	.container {
		height: 100%;
	}
</style>
