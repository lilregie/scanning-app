<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import type { Readable, writable } from 'svelte/store';

	import { Steps as StepsViewer } from 'svelte-steps';
	import { generateSteps, Steps } from './stepManager';
	import { onMount } from 'svelte';
import ScanVaccinePass from './ScanVaccinePass.svelte';
import ScanBarcodeTicket from './ScanBarcodeTicket.svelte';
import AttendeeDetails from '../AttendeeDetails.svelte';
import Card from '../Card.svelte';

	export let attendee: Readable<Attendee>;

	let steps = generateSteps();

    let currentStepID = 0;
    $: currentStep = steps[currentStepID].step;
</script>

<div class="container">
	<div class="stepper-wrapper">
		<StepsViewer {steps} bind:current={currentStepID}/>
	</div>

    <div class="content-slider">
        {#if currentStep===Steps.ScanVaccinePass}
            <ScanVaccinePass/>
        {:else if currentStep===Steps.ScanTicket}
            <ScanBarcodeTicket/>
        {:else if currentStep===Steps.Confirm}
            haha yes {$attendee.first_name}
        {/if}
    </div>

	<div class="attendee-details">
		<AttendeeDetails {attendee} actionsAvailable={false}/>
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

		.attendee-details {
			margin: 2em;
			padding: 2em;
			border: $background-intermediate-dark solid 4px;
			background-color: $background-intermediate-light;
			border-radius: 1em;
			box-sizing: border-box;
			width: 90%;
		}
	}
</style>
