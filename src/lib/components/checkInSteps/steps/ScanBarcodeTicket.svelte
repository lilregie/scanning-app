<script lang="ts">
	import { onMount } from 'svelte';

	import Scanner from '$lib/components//scanner/ScannerWrapper.svelte';

	import { ScanTypes, type Ticket } from '$lib/components/scanner/validateScan';
	import type { ScanSuccess } from '$lib/components/scanner/validateScan';
	import { StageState, type AttendeeProfile } from '../stepManager';
	import type { Writable } from 'svelte/store';
	import { currentEvent, selectedAttendeeID } from '$lib/store';
	import EventletBox from '$lib/components/eventlet/EventletBox.svelte';
	import SuccessTick from '$lib/components/SuccessTick.svelte';
	import Button from '$lib/components/Button.svelte';
	import StepWarning from '../StepWarning.svelte';

	export let attendeeProfile: Writable<AttendeeProfile>;
	export let memory: Writable<Ticket>;
	export let stageState: StageState = StageState.Incomplete;

	let ticketInfo: Ticket;

	function scan(event: { detail: ScanSuccess }) {
		let data = event.detail as ScanSuccess;
		if (!data.valid || data.data.type !== ScanTypes.TicketBarcode) {
			return;
		}

		ticketInfo = data.data;
		memory.set(ticketInfo);

		$attendeeProfile.ticketKey = ticketInfo.key;
	}

	enum TicketWarning {
		AttendeeMismatch
	}

	let ticketWarnings: TicketWarning[] = [];

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
				ticketWarnings.push(TicketWarning.AttendeeMismatch);
			}
		}
	}

	function switchToTicketAttendee() {
		if (ticketInfo?.attendee) {
			$selectedAttendeeID = ticketInfo.attendee.id;
			$attendeeProfile.attendee = ticketInfo.attendee;
		}
	}

	onMount(() => {
		if ($memory !== null) {
			ticketInfo = $memory;
		}
	});
</script>

<div class="scanner-container">
	<div class="scanner-wrapper">
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
						<span class="name">
							{#if $currentEvent?.event_type === 'registration'}
								{`${ticketInfo.attendee.first_name} ${ticketInfo.attendee.last_name}`}
							{:else}
								{`Attendee #${ticketInfo.attendee.id}`}
							{/if}
						</span>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="warnings-containers">
		{#each ticketWarnings as warning}
			{#if warning === TicketWarning.AttendeeMismatch}
				<StepWarning>
					<svelte:fragment slot="title">Warning: Attendee Mismatch</svelte:fragment>
					<svelte:fragment slot="message"
						>The ticket scanned does not match the selected attendee.</svelte:fragment
					>
					<svelte:fragment slot="actions">
						<Button on:click={switchToTicketAttendee} color="success">
							Select
							{#if $currentEvent?.event_type === 'registration'}
								{`${ticketInfo.attendee.first_name} ${ticketInfo.attendee.last_name}`}
							{:else}
								{`Attendee #${ticketInfo.attendee.id}`}
							{/if}
						</Button>
					</svelte:fragment>
				</StepWarning>
			{:else}
				<StepWarning>
					<svelte:fragment slot="title">Warning: Unkown Error</svelte:fragment>
				</StepWarning>
			{/if}
		{/each}
	</div>
</div>

<style lang="scss">
	@use '../../../styles/vars.scss' as *;
	.scanner-container {
		max-width: 50em;
		margin: 0 auto 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 98%;
		.scanner-wrapper {
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
			}
		}
	}
</style>
