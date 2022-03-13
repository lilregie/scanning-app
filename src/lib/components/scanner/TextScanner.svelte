<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Button from '../Button.svelte';

	import TextInput from '../TextInput.svelte';
	import { ScannerStatus } from './scannerStatus';

	const dispatch = createEventDispatcher();

	function onSubmit() {
		dispatch('scan', { qrContent: textContent });
		textContent = '';
	}

	export let previewWidth;
	export let scannerStatus: Writable<ScannerStatus>;

	let textBox: HTMLInputElement;
	let textContent: string;

	scannerStatus.subscribe(async (status) => {
        if (status === ScannerStatus.Scanning) {
			await tick();
            textBox.focus();
		}

    })
</script>

<form
	class="text-input"
	style="--wrapper-height: {previewWidth / 1.77}px"
	on:submit|preventDefault={onSubmit}
>
	<span class="help-text">You can use a 2D barcode reader to scan tickets and vaccine passes!</span>
	<TextInput
		bind:inputComponent={textBox}
		placeholder="Bardcode text goes here..."
		size="large"
		expanded
		bind:textInputValue={textContent}
	/>
	<Button submit={true} size="small" expanded />
</form>

<style lang="scss">
	.text-input {
		height: var(--wrapper-height);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 1rem;
		box-sizing: border-box;
		overflow: hidden;
		.help-text {
			opacity: 0.75;
			// font-style: italic;
			font-size: 1rem;
			margin: -0.5rem;
		}
	}
</style>
