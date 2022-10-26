<script lang="ts">
	import EventletSelector from '$lib/components/eventlet/EventletSelector.svelte';
	import type { Eventlet } from '$lib/event';
	import { currentEvent } from '$lib/store';
	import { findEventletByID } from '$lib/utill';
	import type { Writable } from 'svelte/store';
	import StepLayout from '../StepLayout.svelte';
	import { StageState, type AttendeeProfile } from '../stepManager';

	export let attendeeProfile: Writable<AttendeeProfile>;
	export let stageState = StageState.Complete;

	let selectedValues: Writable<SelectorValue>;

	function selectEventlet(detail: { detail: Eventlet[] }) {
		if (detail.detail.length === 1) {
			$attendeeProfile.checkInEventlet = detail.detail[0];
		}
	}

	function getStartingEventlet(attendeeProfile: AttendeeProfile): Eventlet | null {
		console.log(attendeeProfile);
		if (attendeeProfile?.checkInEventlet) {
			return attendeeProfile.checkInEventlet;
		}
		if (attendeeProfile?.attendee?.attendances?.length == 1) {
			return findEventletByID($currentEvent, attendeeProfile.attendee.attendances[0].eventlet_id);
		}
		return null;
	}

	let eventletIDWhitelist = $attendeeProfile.attendee.attendances.map(
		(attendence) => attendence.eventlet_id
	);

	$: stageState = $selectedValues ? StageState.Complete : StageState.Stay;

	let startingEventlet: Eventlet | Eventlet[] | null = null;
	$: {
		startingEventlet = getStartingEventlet($attendeeProfile);
		$attendeeProfile.checkInEventlet = startingEventlet
	}
</script>

<div class="select-container">
	<h2>Confirm Eventlet</h2>
	<div class="helper-text">Select the eventlet to check-in the attendee into</div>
	<EventletSelector
		startingEventlets={startingEventlet}
		multiSelect={false}
		bind:selectedValues
		{eventletIDWhitelist}
		on:select={selectEventlet}
	/>
</div>

<style lang="scss">
	.select-container {
		width: 80%;
		margin: 0 auto;
		text-align: center;
		h2 {
			font-size: 2rem;
			margin: 1rem;
		}
		.helper-text {
			margin: 1em;
		}
	}
</style>
