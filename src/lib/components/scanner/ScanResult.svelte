<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { ScannerStatus } from './scannerStatus';
	import { tweened } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import { globalModalState } from '$lib/store';

	export let scannerStatus: Writable<ScannerStatus>;
	export let backgroundColour: string = '#fff';

	const openTime = 2500;
	let timeout: NodeJS.Timeout | null = null;
	let timeoutStart: number = Date.now();

	let progressBarPoll: number = 100;

	function getTimeLeft(): number {
		return (Date.now() - timeoutStart) / openTime;
	}

	let percentTime = tweened(0, {
		duration: progressBarPoll
	});

	const close = () => scannerStatus.set(ScannerStatus.Scanning);

	setInterval(() => {
		if (timeout) {
			percentTime.set(getTimeLeft());
		} else {
			percentTime.set(0);
		}
	}, progressBarPoll);

	function setTimer() {
		if ($globalModalState === null) {
			if (timeout) {
				console.log('timer still running?');
			} else {
				timeoutStart = Date.now();
				timeout = setTimeout(close, openTime);
			}
		} else {
			console.log('tried to start timer but modal is open');
		}
	}

	function cancelTimer() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		} else {
			console.log('timer not set');
		}
	}

	globalModalState.subscribe((state) => {
		if (state === null && !timeout) {
			setTimer();
		} else if (timeout) {
			cancelTimer();
		}
	});
</script>

<div
	class="wrapper"
	style="--background-colour: {backgroundColour};"
	transition:fly|local={{ y: 200, duration: 200 }}
	on:mouseleave={setTimer}
	on:mouseenter={cancelTimer}
>
	<div class="progress-bar" style="--percent-time: {100 - $percentTime * 100}%" />
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="close-button"
		fill="currentColor"
		viewBox="0 0 16 16"
		role="button"
		on:click={close}
	>
		<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
		<path
			d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
		/>
	</svg>
	<slot />
</div>

<style lang="scss">
	@use '../../styles/vars.scss' as *;
	.wrapper {
		position: relative;
		background-color: var(--background-colour);
		width: 100%;
		height: var(--fail-response-height);
		display: flex;
		justify-content: center;
		align-items: center;
		color: $text-dark;
		flex-direction: column;
		position: absolute;
		bottom: 0;
		left: 0;

		.progress-bar {
			height: 5px;
			width: var(--percent-time);
			background-color: rgba(255, 255, 255, 0.6);
			position: absolute;
			bottom: 0;
			right: 0;
			z-index: 2;
		}

		.close-button {
			position: absolute;
			top: 16px;
			right: 16px;
			width: 1.5em;
			height: 1.5em;
			cursor: pointer;

			transition: all 0.2s ease-in-out;

			&:hover {
				box-shadow: map-get($shadows, 'large');
			}
		}
	}
</style>
