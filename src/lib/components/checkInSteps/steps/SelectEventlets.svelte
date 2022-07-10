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
			$attendeeProfile.check_in_eventlet = detail.detail[0];
		}
	}

	function getStartingEventlet(attendeeProfile: AttendeeProfile): Eventlet {
		console.log(attendeeProfile);
		if (attendeeProfile?.check_in_eventlet) {
			return attendeeProfile.check_in_eventlet;
		}
		if (attendeeProfile?.ticket_eventlet) {
			return attendeeProfile?.ticket_eventlet;
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

	let startingEventlet = null;
	$: {
		startingEventlet = getStartingEventlet($attendeeProfile);
		$attendeeProfile.check_in_eventlet = startingEventlet
	}
</script>

<div class="select-container">
	<h2>Comfirm Eventlet</h2>
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
