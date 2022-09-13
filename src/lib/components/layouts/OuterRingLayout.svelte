<script lang="ts">
	import logo from '$lib/assets/logo/wordmark-white.svg';

	import { fade, fly } from 'svelte/transition';
	import {
		checkedInCount,
		currentEvent,
		eventletAttendees,
		selectedEventletCombo,
		selectedEventletIDs
	} from '$lib/store';
	import { gitCommitHash } from '$lib/consts';
	
	export let backPath: string;
	export let url: string;

	// Transition between pages
	const pageTransitionDuration = 250;
</script>

<div class="brand">
	<a href={backPath}>
		<img src={logo} alt="Lil Regie logo" title={gitCommitHash}/>
	</a>
</div>

<div class="attendee-count-overview stats-container">
	{#if $eventletAttendees !== null}
		<div class="stat">
			<span class="stat-value">{$checkedInCount}</span>
			<span class="stat-label">Checked In</span>
		</div>

		{#if $selectedEventletCombo?.maximum_attendees}
			<div class="stat">
				<span class="stat-value"
					>{$selectedEventletCombo?.maximum_attendees - $checkedInCount || '??'}</span
				>
				<span class="stat-label">Available Tickets</span>
			</div>
		{/if}

		<div class="stat">
			<span class="stat-value">{$eventletAttendees?.length || '??'}</span>
			<span class="stat-label">Registrations</span>
		</div>
	{/if}
</div>

{#key url}
	<div
		class="transition-wrapper"
		in:fly={{ x: -5, duration: pageTransitionDuration, delay: 1.1 * pageTransitionDuration }}
		out:fade={{ duration: pageTransitionDuration }}
	>
		<slot />
	</div>
{/key}

<div class="event-selection-overview stats-container">
	{#if $currentEvent && $selectedEventletIDs}
		<div class="stat">
			<span class="stat-label">Currently Viewing:</span>
			<span class="stat-value">{$currentEvent.name}</span>
		</div>
		{#if !$currentEvent.standalone}
			<hr class="stat-seperator" />
			<div class="stat">
				{#if $selectedEventletIDs.length <= 3}
					<span class="stat-label">Selected Eventlets: </span>
					<span class="stat-value">{$selectedEventletCombo?.name.join(", ")}</span>
				{:else}
					<!-- Too many to display full names -->
					<span class="stat-value">{$selectedEventletIDs.length}</span>
					<span class="stat-label">Selected Eventlets</span>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	@use '../../styles/vars.scss' as *;
	@use './vars.scss' as *;
	@use 'sass:math';

	.brand {
		position: fixed;
		top: calc($item-spacing / 2);
		left: calc($item-spacing / 2);
		img {
			height: $item-spacing;
			width: auto;
			cursor: pointer;
			transition: filter 150ms ease-in-out;
		}
		&:hover {
			img {
				filter: brightness(0.8);
			}
		}
		@media screen and (max-width: $breakpoint-mobile) {
			position: relative;
			display: flex;
			flex-direction: row;
			justify-content: center;
			left: unset;
		}
	}
	.attendee-count-overview {
		top: calc($item-spacing / 2);
		right: calc($item-spacing / 2);
	}
	.event-selection-overview {
		bottom: calc($item-spacing / 2);
		left: $item-spacing * 2;
	}
	.stats-container {
		$line-height: 1.2rem;
		position: fixed;
		display: flex;
		flex-direction: row;
		color: $text-dark;
		white-space: nowrap;
		text-overflow: ellipsis;
		height: $line-height;
		vertical-align: middle;
		

		.stat {
			margin: 0 1em;
			.stat-value {
				font-weight: bold;
			}
			&:first-child {
				margin: 0 1em 0 0;
			}
		}
		hr.stat-seperator {
			width: 2px;
			height: $line-height;
			display: inline-block;
			margin: 0;
			border: none;
			background-color: $text-dark;

		}
		@media screen and (max-width: $breakpoint-mobile) {
			display: none;
		}
	}

	.transition-wrapper {
		padding: $item-spacing * 2;
		box-sizing: border-box;
		height: 100vh;
		@media screen and (max-width: $breakpoint-mobile) {
			padding: math.div($item-spacing, 2);
			height: initial;
			height: 80vh;
		}
	}
</style>
