<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	import Scanner from '$lib/components//scanner/ScannerWrapper.svelte';
	import StepLayout from '../StepLayout.svelte';

	import { ScanTypes, type NZCovidPass, type Ticket } from '$lib/components/scanner/validateScan';
	import type { ScanResults } from '$lib/components/scanner/validateScan';
	import { StageState, type AttendeeProfile } from '../stepManager';
	import type { Writable } from 'svelte/store';
	import { currentEvent, selectedAttendee, selectedEventletIDs } from '$lib/store';
	import EventletBox from '$lib/components/eventlet/EventletBox.svelte';
	import SuccessTick from '$lib/components/SuccessTick.svelte';
	import { stringify } from 'uuid';

	export let attendeeProfile: Writable<AttendeeProfile>;
	export let memory: Writable<Ticket>;
	export let stageState: StageState = StageState.Incomplete;

	const dispatch = createEventDispatcher();

	let ticketInfo: Ticket;

	function scan(event: { detail: ScanResults }) {
		let data = event.detail as ScanResults;
		if (!data.valid || data.data.type !== ScanTypes.TicketBarcode) {
			return;
		}

		ticketInfo = data.data;
		memory.set(ticketInfo);

		$attendeeProfile.ticketKey = ticketInfo;
	}

	interface warning {
		title: string;
		message: string;
	}

	let ticketWarnings: warning[] = [];

	$: {
		if (!ticketInfo) {
			stageState = StageState.Incomplete;
		} else {
			stageState = ticketWarnings.length > 0 ? StageState.Warning : StageState.Complete;
		}
	}

	$: {
		ticketWarnings = [];
		if (ticketInfo && $attendeeProfile.attendee) {
			if (ticketInfo.attendee.id !== $attendeeProfile.attendee.id) {
				ticketWarnings.push({
					title: 'Attendee Mismatch',
					message: `The ticket scanned does not match the selected attendee.`
				});
			}
		}
	}

	onMount(() => {
		if ($memory !== null) {
			ticketInfo = $memory;
		}
	});
</script>

<div class="scanner-wrapper">
	{$selectedAttendee.ticket_uuid}
	<Scanner enabledScanTypes={[ScanTypes.TicketBarcode]} on:scan-complete={scan} />
	{#if ticketInfo}
		<div class="ticket-info">
			<div class="tick-wrapper">
				{#if ticketWarnings.length === 0}
					<SuccessTick colour="green" />
				{:else}
					<SuccessTick colour="orange" />
				{/if}
			</div>
			<div class="text-container">
				<div class="header">Ticket Valid</div>
				<div class="details">
					<span class="name"
						>{`${ticketInfo.attendee.first_name} ${ticketInfo.attendee.last_name}`}</span
					>
				</div>
			</div>
			{#each ticketWarnings as warning}
				<span class="missmatch-warning">
					<span class="title"><strong>Warning: {warning.title}</strong></span><br/>
					<span class="message">{warning.message}</span>
				</span>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../../../styles/vars.scss' as *;

	.scanner-wrapper {
		max-width: 50em;
		margin: 0 auto;

		.ticket-info {
			background-color: $background-intermediate-light;
			display: flex;

			& > * {
				margin: 0.5rem 1rem;
			}

			.tick-wrapper {
				display: flex;
				justify-content: center;
				align-items: center;

				:global(svg) {
					height: 40px;
				}
			}
			.name {
				text-transform: capitalize;
			}
			.header {
				font-size: 1.5rem;
				font-weight: bold;
				margin-bottom: 0.5rem;
			}
			.missmatch-warning {
				font-size: 1.2rem;
				position: absolute;
				bottom: 1em;
			}
		}
	}
</style>
