<script lang="ts">
	import type { LilRegieEvent } from "$lib/event";
	import type { Attendee, EventletAttendance } from "$lib/attendee";
	import { applyAction } from "$app/forms";
	import { csrfAPIState } from "$lib/api/statusStores";

	export let event: LilRegieEvent
	export let attendance: EventletAttendance
	export let attendee: Attendee
	export let variant: "inline" | "block" = "inline"
	export let ignoreUnpaid: boolean = false

	let disabled: boolean = !!attendee.cancelled_at
	let loading: boolean = false

	async function updateCheckinStatus() {
		disabled = loading = true

		const data = new FormData(this)
		data.append('ignore_unpaid', ignoreUnpaid.toString())

		const response = await fetch(this.action, {
			method: this.method,
			headers: {
				"Accept": "application/json",
			},
			body: data
		})

		if (response.status === 200) {
			const result = await response.json()
			attendance = result satisfies EventletAttendance

			applyAction({ status: response.status, type: "success", data: result })
		} else if (response.type === "error" || response.status >= 500) {
			applyAction({ status: response.status, type: "error", error: response.statusText});
		} else if (response.status >= 400) {
			applyAction({ status: response.status, type: "failure", data: await response.json() })
		}

		disabled = loading = false
	}

	function isCancelled() {
		return !!attendee.cancelled_at
	}
</script>

<form
	on:submit|preventDefault={ updateCheckinStatus }
	action={`/checkin/events/${event.id}/attendances/${attendance.id}/checkin`}
	method="post"
	class="flex-shrink-0"
	class:flex={ variant === "block" }
>
	<input type="hidden" name="authenticity_token" value={ $csrfAPIState } hidden />
	<input type="hidden" name="ticket_uuid" value={ attendee.ticket_uuid } hidden />
	<input type="hidden" name="attendance_id" value={ attendance.id } hidden />
	{#if !!attendance.checked_in_at}
		<input type="hidden" name="_method" value="delete" hidden />
	{/if}
	<button
		class="btn-check-in flex-shrink-0"
		class:isDone={ !!attendance.checked_in_at }
		class:isCancelled={ isCancelled() }
		class:flex-grow={ variant === "block" }
		class:justify-center={ variant === "block" }
		{ disabled }
	>
		{#if loading}
			<svg width="16" height="16" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg" class="animate-spin m-auto">
				<path d="M10 2C10 2.84375 9.3125 3.5 8.5 3.5C7.65625 3.5 7 2.84375 7 2C7 1.1875 7.65625 0.5 8.5 0.5C9.3125 0.5 10 1.1875 10 2ZM10 15C10 15.8438 9.3125 16.5 8.5 16.5C7.65625 16.5 7 15.8438 7 15C7 14.1875 7.65625 13.5 8.5 13.5C9.3125 13.5 10 14.1875 10 15ZM0.5 8.5C0.5 7.6875 1.15625 7 2 7C2.8125 7 3.5 7.6875 3.5 8.5C3.5 9.34375 2.8125 10 2 10C1.15625 10 0.5 9.34375 0.5 8.5ZM16.5 8.5C16.5 9.34375 15.8125 10 15 10C14.1562 10 13.5 9.34375 13.5 8.5C13.5 7.6875 14.1562 7 15 7C15.8125 7 16.5 7.6875 16.5 8.5ZM2.8125 14.1562C2.25 13.5938 2.25 12.625 2.8125 12.0625C3.40625 11.4688 4.375 11.4688 4.9375 12.0625C5.53125 12.625 5.53125 13.5938 4.9375 14.1562C4.375 14.75 3.40625 14.75 2.8125 14.1562ZM4.9375 4.96875C4.375 5.5625 3.40625 5.5625 2.8125 4.96875C2.25 4.40625 2.25 3.4375 2.8125 2.84375C3.40625 2.28125 4.375 2.28125 4.9375 2.84375C5.53125 3.4375 5.53125 4.40625 4.9375 4.96875ZM12.0312 12.0625C12.5938 11.4688 13.5625 11.4688 14.1562 12.0625C14.7188 12.625 14.7188 13.5938 14.1562 14.1562C13.5625 14.75 12.5938 14.75 12.0312 14.1562C11.4375 13.5938 11.4375 12.625 12.0312 12.0625Z"/>
			</svg>
		{:else if isCancelled()}
			Cancelled
		{:else if !!attendance.checked_in_at}
			Checked-in
		{:else}
			Check-in
		{/if}
	</button>
</form>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.btn-check-in {
		border-radius: 8px;
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

		&.isCancelled {
			border-color: map-get($theme-colors, 'warning');
			background: map-get($theme-colors, 'warning');
			color: #FFFFFF;
		}
	}
</style>
