<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import type { Readable, writable } from 'svelte/store';

	import { Steps as StepsViewer } from 'svelte-steps';
	import { generateSteps, Steps } from './stepManager';
	import { onMount } from 'svelte';
	import ScanVaccinePass from './steps/ScanVaccinePass.svelte';
	import ScanBarcodeTicket from './steps/ScanBarcodeTicket.svelte';

	export let attendee: Readable<Attendee>;

	let steps = generateSteps();

	let currentStepID = 0;
	$: currentStep = steps[currentStepID].step;

	function skip() {
		currentStepID++;
    }
    function next() {
		currentStepID++;
    }
	function back() {
		currentStepID--;
	}
</script>

<div class="container">
	<div class="stepper-wrapper">
		<StepsViewer {steps} bind:current={currentStepID} />
	</div>

	<div class="content-slider">
		{#if currentStep === Steps.ScanVaccinePass}
			<ScanVaccinePass on:next={next} on:skip={skip} on:back={back}/>
		{:else if currentStep === Steps.ScanTicket}
			<ScanBarcodeTicket on:next={next} on:skip={skip} on:back={back}/>
		{:else if currentStep === Steps.Confirm}
			haha yes {$attendee.first_name}
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
