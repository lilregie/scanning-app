<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import InvalidCross from './InvalidCross.svelte';

	export let altText = 'Close';
	export let spacing: [string, string] = ['2em', '2em'];

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}
</script>

<button
	on:click={close}
	class="close-button"
	title={altText}
	style={`--top-space: ${spacing[0]}; --right-space: ${spacing[1]};`}
>
	<InvalidCross />
</button>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.close-button {
		position: absolute;
		top: var(--top-space);
		right: var(--right-space);
		z-index: 3;

		border: none;
		background: none;
		cursor: pointer;
		transition: all 200ms ease-in-out;

		&:hover,
		&:focus {
			filter: drop-shadow(0 0 0.5rem map-get($theme-colors, 'danger'));
		}

		:global(svg) {
			width: 2rem;
			height: 2rem;
			fill: #000;
			transition: all 200ms ease-in-out;
		}
	}
</style>
