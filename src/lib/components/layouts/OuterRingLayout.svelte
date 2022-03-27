

<script lang="ts">
	import logo from '$lib/assets/logo/wordmark-white.svg';

	import { fade, fly } from 'svelte/transition';
	import {
		checkedInCount,
		eventletAttendees,
		selectedEventletCombo
	} from '$lib/store';

    import { page } from '$app/stores';


    export let backPath: string;
	export let url: string;

	// Transition between pages
	const pageTransitionDuration = 250;
</script>

<div class="brand">
	<a href={backPath}>
		<img src={logo} alt="Lil Regie logo" />
	</a>
</div>

<div class="stats-container">
	{#if $eventletAttendees !== null}
		<div class="stat">
			<span class="stat-value">{$checkedInCount}</span>
			<span class="stat-label">Checked In</span>
		</div>

		{#if $selectedEventletCombo?.ticket_limit}
			<div class="stat">
				<span class="stat-value"
					>{$selectedEventletCombo?.ticket_limit - $checkedInCount || '??'}</span
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

<style lang="scss">
	@use '../../styles/vars.scss' as *;
	@use './vars.scss' as *;
	@use "sass:math";

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
	.stats-container {
		position: fixed;
		top: calc($item-spacing / 2);
		right: calc($item-spacing / 2);
		display: flex;
		flex-direction: row;
		color: $text-dark;
		.stat {
			margin: 0 1em;
			.stat-value {
				font-weight: bold;
			}
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
