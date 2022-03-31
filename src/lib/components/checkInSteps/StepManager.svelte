<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import { get, writable, type Readable, type Writable } from 'svelte/store';

	import { Steps as StepsViewer } from 'svelte-steps';
	import { generateSteps, Steps, type AttendeeProfile } from './stepManager';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	export let attendee: Readable<Attendee>;

	let attendeeProfile: Writable<AttendeeProfile> = writable({
		attendee: get(attendee),
		eventlet: null,
		ticket_eventlet_id: null,
		covidPassInfo: null
	});

	let steps = [];

	let currentStepID = 0;
	$: currentStep = steps[currentStepID];

	function skip() {
		currentStepID++;
	}
	function next() {
		currentStepID++;
	}
	function back() {
		currentStepID--;
	}

	onMount(() => {
		steps = generateSteps(get(attendeeProfile));
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
				on:skip={skip}
				on:back={back}
				on:force={next}
				{attendeeProfile}
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
