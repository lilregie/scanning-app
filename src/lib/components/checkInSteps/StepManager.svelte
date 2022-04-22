<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import { selectedAttendeeID } from '$lib/store';
	import { generateSteps, initiateCheckIn, type AttendeeProfile } from './stepManager';

	import { get, writable, type Readable, type Writable } from 'svelte/store';
	import { createEventDispatcher, onMount } from 'svelte';

	import { Steps as StepsViewer } from 'svelte-steps';
import type { CurrentSteps } from './currentStepStore';

	const dispatch = createEventDispatcher();

	export let attendeeProfile: Writable<AttendeeProfile>;
	

	let stepManager: CurrentSteps = null;

	// function next() {
	// 	if (currentStepID < steps.length - 1) {
	// 		currentStepID++;
	// 	} else {
	// 		initiateCheckIn(get(attendeeProfile));
	// 		dispatch('close');
	// 	}
	// }

	function updateSelectedAttendee(attendeeProfile: AttendeeProfile) {
		if (attendeeProfile.attendee) {
			$selectedAttendeeID = attendeeProfile.attendee.id;
		}
		console.log("attendeeProfile", attendeeProfile.attendee);
	}
	
	$: updateSelectedAttendee($attendeeProfile);

	// Step memory
	// We want to remember full details about the current step state, so the user can easily backtrack.
	// Each optionaly step exposes a writable store, which is preloaded with the current step state.
	let stepMemory: {
		[key: string]: Writable<any>;
	} = {};

	onMount(() => {
		stepManager = generateSteps(get(attendeeProfile));
	});
</script>

<div class="container">
	{#if stepManager }
		<div class="stepper-wrapper">
			{#if stepManager.steps.length > 0}
				<StepsViewer steps={stepManager.steps} bind:current={stepManager.currentStepID} />
			{/if}
		</div>
		<div class="content-slider">
			{#if stepManager.currentStep}
				<!-- All of the step modules dynamicaly render here -->
				<svelte:component
					this={stepManager.currentStep.component}
					memory={stepManager.currentStep.memory}
					on:next={stepManager.nextStep}
					on:skip={stepManager.nextStep}
					on:back={stepManager.previousStep}
					on:force={stepManager.nextStep}
					{attendeeProfile}
					lastStep={false}
				/>
			{:else}
			loading
			{stepManager.currentStep}
			{/if}
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
