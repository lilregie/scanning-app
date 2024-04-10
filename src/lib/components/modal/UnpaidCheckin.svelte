<script lang="ts">
	import { applyAction } from '$app/forms';
	import { page } from '$app/stores';
	import type { Attendee, EventletAttendance } from '$lib/attendee';
	import type { Errors } from '$lib/errors';
	import type { EventletSingle, LilRegieEvent } from '$lib/event';
	import { globalModalState, updateAttendanceForAttendee } from '$lib/store';
	import { bind } from 'svelte-simple-modal';
	import Alert from '../Alert.svelte';
	import FullAttendeeDetails from './FullAttendeeDetails.svelte';
	import type { Booking } from '$lib/booking';
	import { csrfAPIState } from '$lib/api/statusStores';
	import { readable } from 'svelte/store';

	export let errors: Errors | null = null
	export let event: LilRegieEvent
	export let ticket_uuid: Attendee['ticket_uuid']
	export let selectedEventletId: EventletSingle['id']

	let disabled: boolean = false

	async function checkin(ticket_uuid: string) {
		const data = { eventlet_id: selectedEventletId, authenticity_token: $csrfAPIState, ignore_unpaid: true }

		return await fetch(`/checkin/events/${$page.params.eventID}/tickets/${ticket_uuid}/checkin`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
	}

	async function checkinScan() {
		disabled = true

		try {
			let response = await checkin(ticket_uuid)

			if (response.status === 200) {
				const result = await response.json()
				applyAction({ status: response.status, type: "success", data: result })

				const { attendance, attendee, booking }: {
					attendance: EventletAttendance,
					attendee: Attendee,
					booking: Booking
				} = result

				updateAttendanceForAttendee(attendance)

				$globalModalState = bind(
					FullAttendeeDetails,
					{
						attendance,
						attendee: readable(attendee),
						booking,
						event,
						selectedEventletId
					}
				)
			} else if (response.type === "error" || response.status >= 500) {
				applyAction({ status: response.status, type: "error", error: response.statusText });
			} else if (response.status >= 400) {
				const result = await response.json()
				applyAction({ status: response.status, type: "failure", data: result })

				const booking: Booking = result["booking"]

				if (booking) {
					const attendee = booking.attendees.find((a: Attendee) => a.ticket_uuid === ticket_uuid)
					const errors: Errors = result["errors"]

					$globalModalState = bind(
						FullAttendeeDetails,
						{
							attendee: readable(attendee),
							booking,
							event,
							errors,
							selectedEventletId
						}
					)
				} else {
					errors = result["errors"]
				}
			}
		} catch (error) {
			alert({ content: "Oof, something went wrong. Please try again in a few minutes. If the problem persists, please get in touch." })
		}

		disabled = false
	}
</script>

<div class="complete-container">
	{#if errors}
		<div class="mb-3">
			<Alert { errors } />
		</div>
	{/if}
	<p class="text-center font-bold">Do you still want to check them in?</p>
	<div class="flex gap-4 mt-6">
		<button
			class="btn-next"
			on:click={ () => checkinScan() }
			{ disabled }
		>
			Yes
		</button>
		<button
			class="btn-next"
			on:click={ () => $globalModalState = null }
			{ disabled }
		>
			No
		</button>
	</div>
</div>

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	.btn-next {
		border-radius: 8px;
		border: 1px solid currentColor;
		color: map-get($theme-colors, 'primary');
		display: block;
		fill: currentColor;
		flex-grow: 1;
		font: {
			weight: 700;
		}
		padding: 10px;

		&:hover:not(:disabled) {
			border-color: map-get($theme-colors, 'primary');
			background: map-get($theme-colors, 'primary');
			color: #FFFFFF;
		}
	}
</style>
