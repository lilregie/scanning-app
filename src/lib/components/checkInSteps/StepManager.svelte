<script lang="ts">
	import { selectedAttendee, selectedAttendeeID, stepManagerSettings } from '$lib/store';
	import { backupStep, generateSteps, StageState, type AttendeeProfile } from './stepManager';

	import { get, writable, type Unsubscriber, type Writable } from 'svelte/store';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	import { Steps as StepsViewer } from 'svelte-steps';
	import type { StepItem } from './stepManager';
	import { createCheckIn } from '$lib/api/api';
	import StepLayout from './StepLayout.svelte';
import type { Attendee } from '$lib/attendee';

	const dispatch = createEventDispatcher();

	export let attendeeProfile: Writable<AttendeeProfile | null>;

	let allSteps: StepItem[] = [];
	let idStore: Writable<number> = writable(0);
	let currentStep: StepItem | null = null;
	let currentStepID: number = 0;

	let idUnsubscribe: Unsubscriber | null = null;
	let stepSettingsUnsubscribe: Unsubscriber | null = null;

	function updateSelectedAttendee(attendeeProfile: AttendeeProfile | null) {
		if (attendeeProfile?.attendee && $selectedAttendeeID !== attendeeProfile.attendee.id) {
			$selectedAttendeeID = attendeeProfile.attendee.id;
			console.log("Updated selected attendee with attendee profile", attendeeProfile.attendee);
		}
	}

	function updateAttendeeProfile(selectedAttendee: Attendee | null) {
		if ($attendeeProfile && selectedAttendee?.id !== $attendeeProfile?.attendee?.id) {
			$attendeeProfile.attendee = selectedAttendee;
			console.log("Updated attendee profile with selected attenddee", selectedAttendee);
		}
	}

	$: updateSelectedAttendee($attendeeProfile);
	$: updateAttendeeProfile($selectedAttendee);

	function nextStep() {
		idStore.update((id) => {
			if (id < allSteps.length - 1) {
				return id + 1;
			} else {
				setTimeout(() => {
					createCheckIn(get(attendeeProfile));
					dispatch('close');
				});
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
		stepSettingsUnsubscribe = stepManagerSettings.subscribe((settings) => {
			const [startingID, newSteps] = generateSteps(get(attendeeProfile),settings);
			console.log("Reloading steps with new settings")
			allSteps = newSteps;
			if (get(idStore)===startingID) {
				// If the new ID is the same, the store will not update
				// so we manually trigger the update
				idStore.set(null);
				console.log("Setting ID to null")
			}

			idStore.set(startingID);
		});
		
		function updateCurrentStep(id: number) {
			console.log(
				"wow"
			)
			currentStepID = id;

			// By waiting a tick before setting the current step, we ensure that the previous step has had a chance to destory itself
			// Workaround for following issues
			//
			// https://github.com/sveltejs/svelte/issues/7458
			// https://github.com/sveltejs/svelte/issues/7119
			//
			// TODO: Remove once these issues are resolved
			currentStep = null;
			console.log('Awaiting Tick');
			setTimeout(() => {
				console.log('Ticketed',allSteps,id, allSteps[id]);
				if (allSteps.length > id) {
					currentStep = allSteps[id];
				} else {
					currentStep = backupStep;
				}
			}, 500);
		}

		idUnsubscribe = idStore.subscribe(updateCurrentStep);
	});

	onDestroy(() => {
		if (idUnsubscribe) {
			idUnsubscribe();
		}
		if (stepSettingsUnsubscribe) {
			stepSettingsUnsubscribe();
		}
	});

	let currentStageState: StageState;
</script>

<div class="container">
	<div class="stepper-wrapper">
		{#if allSteps && allSteps.length > 0}
			{#key allSteps}
				<StepsViewer steps={allSteps} bind:current={$idStore} />
			{/key}
		{/if}
	</div>
	<div class="content-slider">
		{#if currentStep}
			<!-- All of the step modules dynamicaly render here -->
			<StepLayout
				stageState={currentStageState}
				on:next={nextStep}
				on:skip={nextStep}
				on:back={previousStep}
				on:force={nextStep}
				on:close={() => dispatch('close')}
				lastStep={$idStore >= allSteps?.length - 1}
				firstStep={$idStore === 0}
			>
				<svelte:component
					this={currentStep.component}
					memory={currentStep.memory}
					bind:stageState={currentStageState}
					bind:attendeeProfile
					on:next={nextStep}
					on:skip={nextStep}
					on:back={previousStep}
					on:force={nextStep}
				/>
			</StepLayout>
		{:else}
			<div class="loading-placeholder">
			</div>
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

		.loading-placeholder {
			height: 100%;
			width: 100%;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;

			box-sizing: border-box;
		}

		@media screen and (max-width: $breakpoint-mobile) {
			width: 85%;
			min-height: 85vh;
		}
	}
</style>
