<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export const load = async ({ url }) => ({ props: { url: url.pathname } });
</script>

<script lang="ts">
	import type { TableRow } from '$lib/components/Table.svelte';

	import AdminLayout from '$lib/components/layouts/AdminLayout.svelte';
	import Scanner from '$lib/components/scanner/ScannerWrapper.svelte';
	import Table from '$lib/components/Table.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Card from '$lib/components/Card.svelte';
	import AttendeeDetails from '$lib/components/AttendeeDetails.svelte';
	import EventletManager from '$lib/components/eventlet/GlobalEventletManager.svelte';

	import { attendeesTable } from '$lib/generateDataVis';
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

	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { fly, fade } from 'svelte/transition';

	import { bind } from 'svelte-simple-modal';
	import { Circle } from 'svelte-loading-spinners';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import ScanResult from '$lib/components/scanner/ScanResult.svelte';
	import { ScanTypes, type ScanResults } from '$lib/components/scanner/validateScan';
	import { findEventletByID } from '$lib/utill';
	import AttendeeMatching from '$lib/components/modal/AttendeeMatching.svelte';
import StepSettings from '$lib/components/checkInSteps/StepSettings.svelte';

	export let url: string;

	let attendeesTableData: [string[], TableRow[]];

	$: {
		// IMPORTANT: This empty function means that the entire block will reload when
		// the $selectedAttendee changes. This is a hack, and should be fixed later on.
		((_) => {})($selectedAttendee);

		attendeesTableData = attendeesTable($eventletAttendees, $attendeesSearchTerm);
	}

	// $: selectedAttendeeCheckedIn = $selectedAttendee &&  $selectedAttendee.check_ins.length === 0;

	let leftBarState: 'ScanAny' | 'ValidateCovidPass' | 'CheckInSuccess' = 'ScanAny';
	let leftBarHighlighted: Writable<boolean> = writable(false);
	let leftBarHighlightedTimeout: NodeJS.Timeout;

	// Used to highlight how the user should verify a covid pass, and the check-in button appears to do nothing
	const highlightTimeMS = 1000;
	const leftBarHighlightedDestroy = leftBarHighlighted.subscribe((highlight) => {
		if (highlight) {
			if (leftBarHighlightedTimeout) {
				clearTimeout(leftBarHighlightedTimeout);
			}
			leftBarHighlightedTimeout = setTimeout(() => {
				leftBarHighlighted.set(false);
			}, highlightTimeMS);
		}
	});

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
				check_in_eventlet: null,
				ticket_eventlet: findEventletByID(get(currentEvent), scanResults.data.eventletID)
			};
			goto(`${basePath}/${$currentEventID}/check-in${await encode_url(attendeeProfile)}`);
		}
	}

	onDestroy(() => {
		if (leftBarHighlightedTimeout) {
			clearTimeout(leftBarHighlightedTimeout);
		}
		leftBarHighlightedDestroy();
	});
</script>

<AdminLayout
	cards={{
		left: { scroll: true, highlighted: $leftBarHighlighted },
		rightBottom: false,
		rightTop: false
	}}
	overflowType={{
		left: 'auto',
		rightTop: 'auto',
		rightBottom: 'auto'
	}}
	backPath={`${basePath}/${$currentEventID}`}
	{url}
>
	<div slot="left-bar" class="left-bar">
		<div class="header-text" out:fade|local in:fly|local={{ y: -200, duration: 1000 }}>
			<h2>Scan a Booking or COVID Pass</h2>
		</div>

		<div class="scanner-container">
			<Scanner on:scan-complete={checkinScan} />
		</div>
		<h2>Scan a booking or COVID pass to begin</h2>
		<div out:fade|local in:fly|local={{ y: 200, duration: 1000 }}>
			Not working or no code? Use the search to the right to bring up the attendee details and mark
			them as checked in.
		</div>
	</div>
	<div slot="info-panel-header">
		<h2 class="panel-header">Attendee Details</h2>
	</div>
	<div slot="info-panel" class="info-panel">
		{#if $selectedAttendee}
			<Card expand={true} scroll={true} background={!!$selectedAttendee}>
				<AttendeeDetails
					attendee={selectedAttendee}
					closeable
					on:checkIn={checkinAttendee}
					on:removeLatestCheckIn={() => {
						removeLatestCheckIn(get(selectedAttendee));
					}}
					on:moreDetails={() => {
						// TODO: Implement detailed attendee deatails page
					}}
					on:close={() => {
						console.log('closing');
						$selectedAttendeeID = null;
					}}
				/>
			</Card>
		{:else}
			<div class="empty-attendee-details-container">
				{#if $currentEvent && !$currentEvent.standalone}
					<EventletManager />
				{:else}
					<p class="no-select-instructions">
						Scan a booking or COVID pass, or search attendees to access their details.
					</p>
				{/if}
				<div class="step-settings-wrapper">
					<h3>Checkin Settings</h3>
					<StepSettings theme="dark"/>
				</div>
			</div>
		{/if}
	</div>
	<div slot="list-panel-header">
		<h2 class="panel-header">Attendees</h2>
		<div class="search-container">
			<TextInput
				placeholder="Search for name, email, booking number, etc"
				expanded
				bind:textInputValue={$attendeesSearchTerm}
			/>
		</div>
	</div>
	<div slot="list-panel" class="table list-panel">
		{#if $eventletAttendees !== null}
			<Table tableHeaders={attendeesTableData[0]} tableData={attendeesTableData[1]} />
		{:else}
			<div class="loading-spinner">
				<Circle color="grey" size="5" unit="em" />
			</div>
		{/if}
	</div>
</AdminLayout>

<style lang="scss">
	@use '../../lib/styles/vars.scss' as *;

	.left-bar {
		text-align: center;
		height: 100%;
		position: relative;
		.header-text {
			h2 {
				font-size: 2rem;
				margin: 1rem;
				&:first-child {
					margin-top: 0;
				}
			}
		}
		.scanner-container {
			width: 100%;
			margin-bottom: 2em;
			position: relative;
			border-radius: 0.7rem;
			:global#cam-preview {
				border-radius: 0.7rem;
			}
		}
	}
	.panel-header {
		display: block;
		color: $text-dark;
		margin: 0;
	}
	.info-panel {
		height: 100%;
		.empty-attendee-details-container {
			display: flex;
			position: relative;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			height: 100%;
			padding: 2em;
			box-sizing: border-box;
			border: $background-intermediate-dark solid 0.5em;
			border-radius: 0.5em;
			color: $text-dark;

			@media screen and (max-width: $breakpoint-mobile) {
				padding: 1em;
				p.no-select-instructions {
					position: absolute;
					bottom: 0;
					font-size: 1.5rem;
					margin: 1em;
				}
			}
			p {
				margin: 0;
				font-size: 1.5rem;
				color: $text-dark;
			}
			.no-select-instructions {
				font-size: 2em;
				opacity: 40%;
				font-weight: 700;
				max-width: 700px;
				text-align: center;
			}
			.step-settings-wrapper {
				width: 15em;
				h3 {
					text-align: center;
				}

			}
		}
	}
	.search-container :global(input),
	.table {
		border-radius: $radius-default;
	}
	.loading-spinner {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.list-panel {
		@media screen and (max-width: $breakpoint-mobile) {
			:global(table td:nth-child(2)) {
				display: none;
			}
			:global(table th:nth-child(2)) {
				display: none;
			}
		}
	}
</style>
