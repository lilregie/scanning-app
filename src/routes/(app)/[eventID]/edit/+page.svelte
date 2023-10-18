<script lang="ts">
	import type { PageData } from './$types';

	import Scanner from '$lib/components/scanner/ScannerWrapper.svelte';

	import type { ScanSuccess } from '$lib/components/scanner/validateScan';
	import { byNameRank } from '$lib/utill';
	import MetaTitle from '$lib/components/MetaTitle.svelte';
	import EventletRadio from '$lib/components/eventlet/EventletRadio.svelte';
	import { page } from '$app/stores';
	import { applyAction } from '$app/forms';
	import { csrfAPIState } from '$lib/api/statusStores';
	import { globalModalState } from '$lib/store';
	import FullAttendeeDetails from '$lib/components/modal/FullAttendeeDetails.svelte';
	import { bind } from 'svelte-simple-modal';
	import { readable } from 'svelte/store';
	import type { Attendee, EventletAttendance } from '$lib/attendee';
	import type { Booking } from '$lib/booking';
	import type { Errors } from '$lib/errors';
	import { alert } from '$lib/noti-store';
	import type { LilRegieEvent } from '$lib/event';

	export let data: PageData;

	async function fetchAttendeeDetails(ticket_uuid: string) {
		return await fetch(`/checkin/events/${$page.params.eventID}/tickets/${ticket_uuid}`, {
			headers: {
				"Accept": "application/json"
			}
		})
	}

	async function checkin(ticket_uuid: string) {
		const data = { eventlet_id: eventletParam, authenticity_token: $csrfAPIState }
		return await fetch(`/checkin/events/${$page.params.eventID}/tickets/${ticket_uuid}/checkin`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
	}

	function parseId(idString: string) {
		if (idString === '') return null

		const id = Number(idString)

		return Number.isNaN(id) ? null : id
	}

	async function checkinScan(event: CustomEvent<ScanSuccess>) {
		disabled = true
		const ticket_uuid = event.detail.data.key;

		try {
			let response

			if (eventletParam === '' || eventletParam === null) {
				response = await fetchAttendeeDetails(ticket_uuid)
			} else {
				response = await checkin(ticket_uuid)
			}

			if (response.status === 200) {
				const result = await response.json()
				applyAction({ status: response.status, type: "success", data: result })

				const { attendance, attendee, booking }: {
					attendance: EventletAttendance,
					attendee: Attendee,
					booking: Booking
				 } = result

				$globalModalState = bind(
					FullAttendeeDetails,
					{
						attendance,
						attendee: readable(attendee),
						booking,
						event: data.event,
						selectedEventletId: parseId(eventletParam)
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
							event: data.event,
							errors,
							selectedEventletId: parseId(eventletParam)
						}
					)
				} else {
					const errors: Errors = result["errors"]
					alert({ errors })
				}
			}
		} catch (error) {
			alert({ content: "Oof, something went wrong. Please try again in a few minutes. If the problem persists, please get in touch." })
		}

		disabled = false
	}

	let eventletParam: string = $page.url.searchParams.get('eventlet') ?? '';
	let disabled = false

	const isTicketOnly = (event: LilRegieEvent) => event.event_type === "ticket_only"
	const showDetailsLabel = (event: LilRegieEvent) => {
		return isTicketOnly(event) ? "Show booking details" : "Show attendee details"
	}
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
				bind:group={ eventletParam }
				{ disabled }
				eventlet={{
					id: 'show-details',
					name: showDetailsLabel(event),
					value: ''
				}}
				showByline={ false }
			/>
			{#each event.eventlets.sort(byNameRank) as eventlet (eventlet.id)}
				{#if event.standalone}
					<EventletRadio
						{ disabled }
						bind:group={ eventletParam }
						eventlet={{ ...eventlet, name: "Check attendee in" }}
						showByline={ false }
					/>
				{:else}
					<EventletRadio {eventlet} bind:group={ eventletParam } { disabled } />
				{/if}
			{/each}
		</form>
	</div>
{/await}

<style lang="scss">
	@use '../../../../lib/styles/vars.scss' as *;
</style>
