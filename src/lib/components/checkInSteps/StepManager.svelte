<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import { get, writable, type Readable, type Writable } from 'svelte/store';

	import { Steps as StepsViewer } from 'svelte-steps';
	import { generateSteps, initiateCheckIn, Steps, type AttendeeProfile } from './stepManager';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
import { selectedAttendeeID } from '$lib/store';

	const dispatch = createEventDispatcher();

	export let attendeeProfile: Writable<AttendeeProfile>;
	

	let steps = [];

	let currentStepID = 0;
	$: currentStep = steps[currentStepID];

	function next() {
		if (currentStepID < steps.length - 1) {
			currentStepID++;
		} else {
			initiateCheckIn(get(attendeeProfile));
			dispatch('close');
		}
	}
	function back() {
		currentStepID--;
	}

	function updateSelectedAttendee(attendeeProfile: AttendeeProfile) {
		if (attendeeProfile.attendee) {
			$selectedAttendeeID = attendeeProfile.attendee.id;
		}
	}
	
	$: updateSelectedAttendee($attendeeProfile);

	onMount(() => {
		[steps,currentStepID] = generateSteps(get(attendeeProfile));
	});
</script>

<div class="container">
	{#if steps.length > 0}
		<div class="stepper-wrapper">
			<StepsViewer {steps} bind:current={currentStepID} />
		</div>
		<div class="content-slider">
			<!-- All of the step modules dynamicaly render here -->
			<svelte:component
				this={currentStep.component}
				on:next={next}
				on:skip={next}
				on:back={back}
				on:force={next}
				{attendeeProfile}
				lastStep={currentStepID>=steps.length-1}
			/>
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;

		.stepper-wrapper {
			// position: absolute;
			// bottom: 0;
			margin-bottom: 2em;
			width: 50%;
		}
		.content-slider {
			height: 85%;
			width: 100%;
		}
	}
</style>
