<script lang="ts">
	import type { Readable } from 'svelte/store';
	import type { Attendee, EventletAttendance } from '$lib/attendee';

	import CloseButton from './CloseButton.svelte';

	import type { LilRegieEvent } from '$lib/event';
	import CheckinAction from './CheckinAction.svelte';
	import { globalModalState } from '$lib/store';
	import type { Booking } from '$lib/booking';
	import type { Errors } from '$lib/errors';
	import Alert from './Alert.svelte';

	export let closeable: boolean = false;

	export let attendance: EventletAttendance | null = null
	export let attendee: Readable<Attendee>
	export let booking: Booking
	export let event: LilRegieEvent
	export let errors: Errors | null = null
	export let selectedEventletId: number | null = null

	const remainingAttendances = $attendee.attendances.filter(attendance => {
		return attendance.eventlet_id !== selectedEventletId
	})
	.sort((a, b) => (a.eventlet_name > b.eventlet_name ? 1 : -1) )

	const otherAttendees = booking.attendees.filter(a => a.id !== $attendee.id)
	const otherAttendances = otherAttendees.flatMap(attendee => {
		return attendee.attendances.map(attendance => ({ attendee, attendance }))
	})
	.filter(({ attendance }) => {
		if (selectedEventletId === null) return true

		return attendance.eventlet_id === selectedEventletId
	})
	.sort((a, b) => (a.attendance.eventlet_name > b.attendance.eventlet_name ? 1 : -1))
</script>

{#if closeable}
	<CloseButton on:close altText="Close Attendee Details" spacing={['0', '0']} />
{/if}
<div class="complete-container">
	{#if errors}
		<div class="mb-3">
			<Alert { errors } />
		</div>
	{/if}
	{#if attendance}
		<div class="mb-3">
			<CheckinAction { event } { attendance } attendee={ $attendee } variant="block" />
		</div>
	{/if}
	<h2 class="title">
		{#if event.event_type === "registration"}
			{$attendee.first_name} {$attendee.last_name}
		{:else}
			Booking #{ $attendee.booking_id }
		{/if}
	</h2>
	{#if event.event_type === "registration"}
		<p class="text-center">Booking #{ $attendee.booking_id }</p>
	{/if}
	{#if remainingAttendances.length > 0}
		<div>
			<p class="text-center">Attending:</p>
			<ol class="other-attendances">
				{#each remainingAttendances as attendance (attendance.id, attendance.checked_in_at)}
					<li class="card">
						<div class="text-black">{ attendance.eventlet_name }</div>
						<CheckinAction { event } { attendance } attendee={ $attendee } />
					</li>
				{/each}
			</ol>
		</div>
	{/if}
	{#if otherAttendances.length > 0}
		<hr class="my-6" />
		<p class="font-bold text-center text-xl">
			There { otherAttendees.length === 1 ? "is" : "are" } { otherAttendees.length }
			other { otherAttendees.length === 1 ? "attendee" : "attendees" } on this
			booking attending
			{#if selectedEventletId}
				{ otherAttendances[0]["attendance"].eventlet_name }
			{/if}
		</p>
		<div>
			<ol class="other-attendances">
				{#each otherAttendances as { attendee, attendance } (attendance.id, attendance.checked_in_at)}
					<li class="card">
						<div>
							<div class="text-bold">{ attendee.first_name } { attendee.last_name }</div>
							<div class="text-black">{ attendance.eventlet_name }</div>
						</div>
						<CheckinAction { event } { attendance } { attendee } />
					</li>
				{/each}
			</ol>
		</div>
	{/if}
	<button
		class="btn-back mt-6"
		on:click={ () => $globalModalState = null }
	>
		Back to Scanner
	</button>
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.title {
		@apply text-3xl text-center;
		color: map-get($theme-colors, 'primary');
	}

	h2 {
		margin: 0 0 0.25em 0;
	}

	.other-attendances {
		@apply mt-4 space-y-3;
	}

	.complete-container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.btn-back {
		border-radius: 8px;
		border: 1px solid currentColor;
		color: map-get($theme-colors, 'primary');
		display: block;
		fill: currentColor;
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
