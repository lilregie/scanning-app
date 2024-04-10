<script lang="ts">
	import type { PageData } from './$types.js';
	import type { EventletSingle } from '$lib/event'
	import type { EventletAttendance } from '$lib/attendee.js';
	import type { Errors } from '$lib/errors.js';
	import { page } from '$app/stores';
	import MetaTitle from '$lib/components/MetaTitle.svelte';
	import { allEventAttendees, bookings, qParam, selectedEventletId, checkinStatusParam, filteredBookings, globalModalState } from '$lib/store.js';
	import { byNameRank, getEventletIdFromFormData } from '$lib/utill.js';
	import { applyAction } from '$app/forms';
	import { csrfAPIState } from '$lib/api/statusStores.js';
	import UnpaidCheckin from '$lib/components/modal/UnpaidCheckin.svelte';
	import { bind } from 'svelte-simple-modal';
	import { alert } from '$lib/noti-store.js';

	export let data: PageData;

	const params = $page.url.searchParams;
	let eventletParam: string | null = params.get('eventlet');
	$qParam = params.get('q') ?? '';
	$: $selectedEventletId = eventletParam ? Number.parseInt(eventletParam) : null
	$bookings = data.bookings
	$allEventAttendees = $bookings.flatMap(booking => booking.attendees)

	type EventletOption = { id: string, name: string }

	function sortedEventletOptions(eventlets: EventletSingle[]): EventletOption[] {
		return eventlets.map(e => ({ id: e.id.toString(), name: e.name })).sort(byNameRank)
	}

	let disabled: boolean = false
	let updatingAttendance: EventletAttendance;

	async function updateCheckinStatus(event) {
		disabled = true

		const formData = new FormData(this)
		try {
			const response = await fetch(this.action, {
				method: this.method,
				body: formData
			})

			if (response.status === 200) {
				const attendance = await response.json() satisfies EventletAttendance
				const attendeeId = attendance.attendee_id
				const attendee = $allEventAttendees.find(attendee => attendee.id === attendeeId)

				if (attendee) {
					attendee.attendances = [...attendee.attendances.filter(a => a.id !== attendance.id), attendance]
					$bookings = $bookings // trigger update
				}

				applyAction({ status: response.status, type: "success", data: attendance})
			} else if (response.type === "error" || response.status >= 500) {
				applyAction({ status: response.status, type: "error", error: response.statusText});
			} else if (response.status == 409) {
				const result = await response.json()
				applyAction({ status: response.status, type: "failure", data: result })
				const errors: Errors = result["errors"]

				$globalModalState = bind(
					UnpaidCheckin,
					{
						errors,
						event: await data.event,
						ticket_uuid: formData.get("ticket_uuid"),
						selectedEventletId: getEventletIdFromFormData(formData)
					}
				)
			} else if (response.status >= 400) {
				const result = await response.json()
				applyAction({ status: response.status, type: "failure", data: result })

				const errors: Errors = result["errors"]
				alert({ errors })
			}
		} catch (error) {
			alert({ content: "Oof, something went wrong. Please try again in a few minutes. If the problem persists, please get in touch." })
		}

		disabled = false
	}
</script>

{#await data.event}
	Loading…
{:then event}
	<MetaTitle parts={ [event.name, "Bookings"] } />

	<form action="?" method="GET" class="space-y-4">
		{#if !event.standalone}
			<div class="flex flex-col">
				<label for="eventlet">Show bookings for</label>
				<select id="eventlet" name="eventlet" class="eventlet-select w-full" bind:value={eventletParam}>
					<option value={ null }>All Eventlets</option>
					{#each sortedEventletOptions(event.eventlets) as option (option.id)}
						<option value={ option.id}>{ option.name }</option>
					{/each}
				</select>
			</div>
		{/if}
		<div class="flex items-center">
			<label for="q" hidden>Name or booking number</label>
			<input
				type="text"
				id="q"
				name="q"
				class="lookup flex-grow"
				placeholder="Name or booking #"
				bind:value={ $qParam }
			>
			<button type="submit" class="btn-filter flex-shrink-0 p-3">
				<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M23.0367 22.0332L17.0171 16.0137C18.3199 14.4414 19.0386 12.4199 19.0386 10.2188C19.0386 5.09766 14.8159 0.875 9.69485 0.875C4.52884 0.875 0.396027 5.09766 0.396027 10.2188C0.396027 15.3848 4.57376 19.5625 9.69485 19.5625C11.8511 19.5625 13.8726 18.8438 15.4898 17.541L21.5093 23.5605C21.7339 23.7852 22.0034 23.875 22.3179 23.875C22.5874 23.875 22.857 23.7852 23.0367 23.5605C23.4859 23.1562 23.4859 22.4824 23.0367 22.0332ZM2.55228 10.2188C2.55228 6.26562 5.74173 3.03125 9.73978 3.03125C13.6929 3.03125 16.9273 6.26562 16.9273 10.2188C16.9273 14.2168 13.6929 17.4062 9.73978 17.4062C5.74173 17.4062 2.55228 14.2168 2.55228 10.2188Z" />
				</svg>
			</button>
		</div>
		<div class="text-center space-x-2">
			<input type="radio" name="filter" id="checked_in_all" value="" hidden bind:group={$checkinStatusParam}>
			<label for="checked_in_all" class="badge">All</label>
			<input type="radio" name="filter" id="not_checked_in" value="false" hidden bind:group={$checkinStatusParam}>
			<label for="not_checked_in" class="badge">Not checked in</label>
			<input type="radio" name="filter" id="checked_in" value="true" hidden bind:group={$checkinStatusParam}>
			<label for="checked_in" class="badge">Checked in</label>
		</div>
	</form>
{/await}

{#await data.bookings}
	Loading booking data
{:then bookings}
<ol class="mt-4 space-y-3">
	{#each $filteredBookings as booking (booking.id)}
	<li class="panel">
		<div class="flex-grow">
			<div class="text-bold">{ booking.billing_first_name } { booking.billing_last_name }</div>
			<div class="text-black">Booking #{ booking.id }</div>
			<ol class="mt-5 space-y-3">
				{#each booking.attendees as attendee (attendee.id)}
					{#each attendee.attendances as attendance (attendance.id)}
						<li class="card">
							<span class="text-black">
								{ booking.id }-{ attendee.ticket_sequence.toString().padStart(2, 0) }
								({ attendance.eventlet_name })
							</span>
							<form
								on:submit|preventDefault={updateCheckinStatus}
								action={`/checkin/events/${$page.params.eventID}/attendances/${attendance.id}/checkin`}
								method="post"
								class="flex-shrink-0"
							>
								<input type="hidden" name="authenticity_token" value={ $csrfAPIState } hidden />
								<input type="hidden" name="ticket_uuid" value={ attendee.ticket_uuid } hidden />
								<input type="hidden" name="attendance_id" value={ attendance.id } hidden />
								<input type="hidden" name="eventlet_id" value={ attendance.eventlet_id } hidden />
								{#if !!attendance.checked_in_at}
									<input type="hidden" name="_method" value="delete" hidden />
								{/if}
								<button
									class="btn-check-in flex-shrink-0"
									class:isDone={ !!attendance.checked_in_at }
									disabled={ disabled }
									on:click={ () => updatingAttendance = attendance }
								>
									{#if disabled && updatingAttendance == attendance}
										<svg width="16" height="16" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
											<path d="M10 2C10 2.84375 9.3125 3.5 8.5 3.5C7.65625 3.5 7 2.84375 7 2C7 1.1875 7.65625 0.5 8.5 0.5C9.3125 0.5 10 1.1875 10 2ZM10 15C10 15.8438 9.3125 16.5 8.5 16.5C7.65625 16.5 7 15.8438 7 15C7 14.1875 7.65625 13.5 8.5 13.5C9.3125 13.5 10 14.1875 10 15ZM0.5 8.5C0.5 7.6875 1.15625 7 2 7C2.8125 7 3.5 7.6875 3.5 8.5C3.5 9.34375 2.8125 10 2 10C1.15625 10 0.5 9.34375 0.5 8.5ZM16.5 8.5C16.5 9.34375 15.8125 10 15 10C14.1562 10 13.5 9.34375 13.5 8.5C13.5 7.6875 14.1562 7 15 7C15.8125 7 16.5 7.6875 16.5 8.5ZM2.8125 14.1562C2.25 13.5938 2.25 12.625 2.8125 12.0625C3.40625 11.4688 4.375 11.4688 4.9375 12.0625C5.53125 12.625 5.53125 13.5938 4.9375 14.1562C4.375 14.75 3.40625 14.75 2.8125 14.1562ZM4.9375 4.96875C4.375 5.5625 3.40625 5.5625 2.8125 4.96875C2.25 4.40625 2.25 3.4375 2.8125 2.84375C3.40625 2.28125 4.375 2.28125 4.9375 2.84375C5.53125 3.4375 5.53125 4.40625 4.9375 4.96875ZM12.0312 12.0625C12.5938 11.4688 13.5625 11.4688 14.1562 12.0625C14.7188 12.625 14.7188 13.5938 14.1562 14.1562C13.5625 14.75 12.5938 14.75 12.0312 14.1562C11.4375 13.5938 11.4375 12.625 12.0312 12.0625Z"/>
										</svg>
									{:else if !!attendance.checked_in_at}
										Checked-in
									{:else}
										Check-in
									{/if}
								</button>
							</form>
						</li>
					{/each}
				{/each}
			</ol>
		</li>
	{/each}
</ol>
{/await}

<style lang="scss">
	@use '../../../../lib/styles/vars.scss' as *;

	.eventlet-select {
		border-radius: 5px;
		border: 1px solid #DFDFDF;
		background: #FFFFFF;
		padding: 1em;
		max-width: 100%;
		inset: none;
	}

	.lookup {
		border-radius: 5px 0px 0px 5px;
		border: 1px solid #DFDFDF;
		background: #FFF;
		padding: 0.75em;
	}

	.badge {
		border-radius: 9999px;
		background: #DADADA;
		color: map-get($theme-colors, 'primary');
		display: inline-block;
		padding: 0.5em 1em;
	}

	input:checked + .badge {
		background: #FFFFFF;
		color: #000000;
	}

	label[for] {
		cursor: pointer;
	}

	.btn-filter {
		border-radius: 5px 0px 0px 5px;
		border: 1px solid #DFDFDF;
		fill: #FFFFFF;
		background: map-get($theme-colors, 'primary');
	}

	.btn-check-in {
		border-radius: 10px;
		border: 1px solid currentColor;
		color: map-get($theme-colors, 'primary');
		fill: currentColor;
		font: {
			weight: 700;
		}
		line-height: 1;
		padding: 10px;

		&:disabled {
			cursor: not-allowed;
		}

		&:hover:not(:disabled) {
			border-color: map-get($theme-colors, 'primary');
			background: map-get($theme-colors, 'primary');
			color: #FFFFFF;
		}

		&.isDone {
			border-color: #3DC393;
			background: #3DC393;
			color: #FFFFFF;

			&:hover:not(:disabled) {
				border-color: currentColor;
				background: #FFFFFF;
				color: #3DC393;
			}
		}
	}

	.panel {
		border-radius: 10px;
		background: #FFF;
		color: map-get($map: $theme-colors, $key: "primary");
		padding: 12px 20px;
	}

	.card {
		@apply bg-gray-50;
	}
</style>
