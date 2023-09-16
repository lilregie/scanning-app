<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Readable } from 'svelte/store';
	import type { Attendee } from '$lib/attendee';

	import CloseButton from './CloseButton.svelte';

	import type { LilRegieEvent } from '$lib/event';
	import CheckinAction from './CheckinAction.svelte';
	import Button from './Button.svelte';
	import { globalModalState } from '$lib/store';

	const dispatch = createEventDispatcher();

	export let attendee: Readable<Attendee>;
	export let event: LilRegieEvent
	export let closeable: boolean = false;
</script>

{#if closeable}
	<CloseButton on:close altText="Close Attendee Details" spacing={['0', '0']} />
{/if}
<div class="complete-container">
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
	{#if $attendee.attendances.length > 1}
		<div class="mb-6">
			<p class="text-center">Attending:</p>
			<ol class="other-bookings">
			{#each $attendee.attendances.sort((a, b) => (a.eventlet_name > b.eventlet_name ? 1 : -1) ) as attendance}
				<li class="card">
					<div class="text-black">{ attendance.eventlet_name }</div>
					<CheckinAction { event } { attendance } attendee={ $attendee } />
				</li>
				{/each}
			</ol>
		</div>
	{/if}
	<button
		class="btn-back"
		on:click={ () => $globalModalState = null }
	>
		Back to Scanner
	</button>
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.title {
		@apply mt-6 text-3xl text-center;
		color: map-get($theme-colors, 'primary');
	}

	h2 {
		margin: 0 0 0.25em 0;
	}

	.other-bookings {
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
