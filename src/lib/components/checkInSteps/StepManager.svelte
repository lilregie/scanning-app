<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import { selectedAttendeeID } from '$lib/store';
	import { generateSteps, initiateCheckIn, type AttendeeProfile } from './stepManager';

	import { get, writable, type Readable, type Writable } from 'svelte/store';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	import { Steps as StepsViewer } from 'svelte-steps';
	import { tick } from 'svelte';
	import type { StepItem } from './stepManager';

	const dispatch = createEventDispatcher();

	export let attendeeProfile: Writable<AttendeeProfile>;

	let allSteps: StepItem[] = null;
	let idStore: Writable<number> = null;
	let currentStep: StepItem = null;
	let currentStepID: number = 0;

	let idUnsubscribe = null;

	function updateSelectedAttendee(attendeeProfile: AttendeeProfile) {
		if (attendeeProfile.attendee) {
			$selectedAttendeeID = attendeeProfile.attendee.id;
		}
		console.log('attendeeProfile', attendeeProfile.attendee);
	}

	$: updateSelectedAttendee($attendeeProfile);

	function nextStep() {
		idStore.update((id) => {
			if (id < allSteps.length - 1) {
				return id + 1;
			} else {
				setTimeout(()=>{
					initiateCheckIn(get(attendeeProfile));
					dispatch('close');
				})
				return id;
			}
		});
	}

	function previousStep() {
		idStore.update((id) => {
			if (id > 0) {
				return id - 1;
			}
			return id;
		});
	}

	onMount(() => {
		const [startingID, newSteps] = generateSteps(get(attendeeProfile));
		idStore = writable(startingID);
		allSteps = newSteps;

		idStore.subscribe(async (id) => {
			currentStepID = id;

			// By waiting a tick before setting the current step, we ensure that the previous step has had a chance to destory itself
			// Workaround for following issues
			//
			// https://github.com/sveltejs/svelte/issues/7458
			// https://github.com/sveltejs/svelte/issues/7119
			//
			// TODO: Remove once these issues are resolved
			currentStep = null;
			await tick();
			currentStep = allSteps[id];
		});
	});

	onDestroy(() => {
		idUnsubscribe();
	});
</script>

<div class="container">
	<div class="stepper-wrapper">
		{#if allSteps && allSteps.length > 0}
			<StepsViewer steps={allSteps} bind:current={currentStepID} />
		{/if}
	</div>
	<div class="content-slider">
		{#if currentStep}
			<!-- All of the step modules dynamicaly render here -->
			<svelte:component
				this={currentStep.component}
				memory={currentStep.memory}
				on:next={nextStep}
				on:skip={nextStep}
				on:back={previousStep}
				on:force={nextStep}
				{attendeeProfile}
				lastStep={false}
			/>
		{:else}
			loading
			{currentStep}
		{/if}
	</div>
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
