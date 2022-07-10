<script lang="ts">
	import EventletSelector from '$lib/components/eventlet/EventletSelector.svelte';
	import type { Writable } from 'svelte/store';
	import StepLayout from '../StepLayout.svelte';
	import { StageState, type AttendeeProfile } from '../stepManager';

	export let attendeeProfile: Writable<AttendeeProfile>;
    export let stageState: StageState = StageState.Complete;


    let selectedValues: Writable<SelectorValue>;

    let eventletIDWhitelist = $attendeeProfile.attendee.attendances.map((attendence) => attendence.eventlet_id);

    $: stageState = $selectedValues ? StageState.Complete : StageState.Stay;
</script>

<div class="select-container">
    <h2>Comfirm Eventlet</h2>
    <div class="helper-text">Select the eventlet to check-in the attendee into</div>
    <EventletSelector
        startingEventlets={$attendeeProfile.ticket_eventlet ?? null}
        multiSelect={false}
        bind:selectedValues={selectedValues}
        {eventletIDWhitelist}
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