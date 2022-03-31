<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Scanner from '$lib/components//scanner/ScannerWrapper.svelte';
	import StepLayout from '../StepLayout.svelte';

	import { ScanTypes, type NZCovidPass, type Ticket } from '$lib/components/scanner/validateScan';
	import type { ScanResults } from '$lib/components/scanner/validateScan';
	import { StageState, type AttendeeProfile } from '../stepManager';
	import type { Writable } from 'svelte/store';
	import { selectedEventletIDs } from '$lib/store';
	import EventletBox from '$lib/components/eventlet/EventletBox.svelte';
	import SuccessTick from '$lib/components/SuccessTick.svelte';

	export let attendeeProfile: Writable<AttendeeProfile>;

	const dispatch = createEventDispatcher();

	let ticketInfo: Ticket = null;

	function next() {
		$attendeeProfile.ticket_eventlet_id = ticketInfo.eventletID;
		dispatch('next');
	}

	function scan(event: { detail: ScanResults }) {
		let data = event.detail as ScanResults;
		if (!data.valid || data.data.type !== ScanTypes.TicketBarcode) {
			return;
		}

		ticketInfo = data.data;
	}

	let stageState: StageState = StageState.Incomplete;

	$: {
		if (!$attendeeProfile.ticket_eventlet_id) {
			stageState = StageState.Incomplete;
		} else {
			stageState = showWarning() ? StageState.Warning : StageState.Complete;
		}
	}

	function showWarning() {
		const attendee = $attendeeProfile.attendee;

		if (!ticketInfo || !$attendeeProfile.attendee) {
			return false;
		}
		return (
			ticketInfo.attendee.id !== attendee.id ||
			!$selectedEventletIDs.includes(ticketInfo.eventletID)
		);
	}

	interface warning {
		title: string;
		message: string;
	}

	let ticketWarnings: warning[] = [];

	$: {
		// new function scope
		(() => {
			ticketWarnings = [];
			if (!ticketInfo || !$attendeeProfile.attendee) {
				return;
			}

			if (ticketInfo.attendee.id !== $attendeeProfile.attendee.id) {
				ticketWarnings.push({
					title: 'Attendee Mismatch',
					message: `The ticket scanned does not match the selected attendee.`
				});
			}

			if (!$selectedEventletIDs.includes(ticketInfo.eventletID)) {
				ticketWarnings.push({
					title: 'Eventlet Mismatch',
					message: `The ticket scanned does not match any of the selected eventlets.`
				});
			}
		})();
	}
</script>

<StepLayout {stageState} on:next={next} on:skip on:back on:force={next}>
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
						<span class="name"
							>{`${ticketInfo.attendee.first_name} ${ticketInfo.attendee.last_name}`}</span
						>
					</div>
				</div>
				<div>
					<EventletBox eventletId={ticketInfo.eventletID} />
				</div>
			</div>
		{/if}
	</div>

	{#if ticketWarnings.length > 0}
		<span class="missmatch-warning">
			<strong>Warning:</strong> The name on this pass does not match selected Attendee.
		</span>
	{/if}
</StepLayout>

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
		}
	}
	.missmatch-warning {
		font-size: 1.2rem;
		position: absolute;
		bottom: 1em;
	}
</style>
