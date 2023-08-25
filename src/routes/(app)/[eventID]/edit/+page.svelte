<script lang="ts">
	import type { PageData } from './$types';

	import Scanner from '$lib/components/scanner/ScannerWrapper.svelte';

	import { createCheckIn, removeLatestCheckIn } from '$lib/api/api';
	import {
		attendeesSearchTerm,
		eventletAttendees,
		globalModalState,
		selectedAttendee,
		selectedAttendeeID,
		currentEventID,
		currentEvent,
		stepManagerSettings
	} from '$lib/store';
	import { basePath } from '$lib/consts';
	import { encode_url } from '$lib/components/checkInSteps/encodeAttendeeProfileURL';
	import { generateSteps, type AttendeeProfile } from '$lib/components/checkInSteps/stepManager';

	import { bind } from 'svelte-simple-modal';
	import { goto } from '$app/navigation';
	import ScanResult from '$lib/components/scanner/ScanResult.svelte';
	import { ScanTypes, type ScanResults } from '$lib/components/scanner/validateScan';
	import { findEventletByID, byNameRank } from '$lib/utill';
	import AttendeeMatching from '$lib/components/modal/AttendeeMatching.svelte';
	import StepSettings from '$lib/components/checkInSteps/StepSettings.svelte';
	import { stringify } from 'uuid';
	import MetaTitle from '$lib/components/MetaTitle.svelte';
	import EventletRadio from '$lib/components/eventlet/EventletRadio.svelte';
	import { page } from '$app/stores';

	export let data: PageData;

	let leftBarState: 'ScanAny' | 'ValidateCovidPass' | 'CheckInSuccess' = 'ScanAny';

	async function checkinAttendee() {
		let attendeeProfile: AttendeeProfile = {
			attendee: $selectedAttendee,
			covidPass: $selectedAttendee.vaccine_pass,
			check_in_eventlet: null,
			ticket_eventlet: null
		};

		// Check if any steps are neededd to complete the check-in process
		let [, steps] = generateSteps(attendeeProfile, $stepManagerSettings);
		if (steps.length > 0) {
			goto(`${basePath}/${$currentEventID}/check-in${await encode_url(attendeeProfile)}`);

		} else {
			// No steps needed, so we directly check-in now
			createCheckIn(attendeeProfile);
		}
	}

	async function checkinScan(event: CustomEvent<ScanResults>) {
		let scanResults = event.detail;

		if (scanResults.data.type === ScanTypes.CovidPass) {
			// The vaccine pass name matching windows manages the check-in process

			globalModalState.set(bind(AttendeeMatching, { data: scanResults.data }));
		} else if (scanResults.data.type === ScanTypes.TicketBarcode) {
			// If it's a ticket, we can go straight to the check-in process
			let attendeeProfile: AttendeeProfile = {
				attendee: scanResults.data.attendee,
				covidPass: scanResults.data.attendee.vaccine_pass,
				ticketKey: scanResults.data.key
			};
			goto(`${basePath}/${$currentEventID}/check-in${await encode_url(attendeeProfile)}`);
		}
	}

	let eventletParam: string = $page.url.searchParams.get('eventlet') ?? '';
</script>

{#await data.event then event}
	<MetaTitle parts={ [event.name, "Scan"] } />

	<div class="scanner-container">
		<Scanner on:scan-complete={checkinScan} />
	</div>
	<div>
		<h1>Scan ticket and…</h1>
		<form class="flex flex-col gap-2">
			<EventletRadio
				eventlet={{
					id: 'show-attendee-details',
					name: 'Show attendee details',
					value: ''
				}}
				bind:group={eventletParam}
			/>
			{#each event.eventlets.sort(byNameRank) as eventlet (eventlet.id)}
				{#if event.standalone}
					<EventletRadio bind:group={eventletParam}>
						<div slot="content">Check attendee in</div>
					</EventletRadio>
				{:else}
					<EventletRadio {eventlet} bind:group={eventletParam} />
				{/if}
			{/each}
		</form>
	</div>
{/await}

<style lang="scss">
	@use '../../../../lib/styles/vars.scss' as *;
</style>
