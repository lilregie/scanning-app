<script lang="ts">
	import { validateScan } from '$lib/validateScan';

	import QR from 'modern-svelte-qr-scanner';
	import { Circle } from 'svelte-loading-spinners';
	import { transition_in } from 'svelte/internal';

	import { get, writable } from 'svelte/store';
	import { fly } from 'svelte/transition';

	enum ScannerStatus {
		Scanning,
		ConfirmScan,
		Invaild
	}
	let scannerStatus = writable(ScannerStatus.Scanning);
	scannerStatus.subscribe((status) => {
		if (status === ScannerStatus.Invaild) {
			setTimeout(() => {
				scannerStatus.set(ScannerStatus.Scanning);
			}, 10000);
		}
	});

	function handleScan(event: CustomEvent) {
		if (get(scannerStatus) === ScannerStatus.Scanning) {
			console.log(validateScan(event.detail.qrContent));
			scannerStatus.set(ScannerStatus.ConfirmScan);
		}
	}

	let previewWidth;
	let mediaErrorMessage = '';
</script>

<div class="qr-container">
	<!-- Always render QR Scanner we enabled (so we hide it instead of remove it) -->
	<div class="qr-wrapper" bind:clientWidth={previewWidth}>
		{#if $scannerStatus === ScannerStatus.ConfirmScan}
			<div class="comfirm" in:fly={{ y: previewWidth, duration: 500 }} out:fly>
				are ya really sure
			</div>
		{:else if $scannerStatus === ScannerStatus.Invaild}
			<div class="fail" in:fly={{ y: previewWidth, duration: 500 }} out:fly>no can do</div>
		{/if}
		<QR
			on:scan={handleScan}
			previewWidth_px={previewWidth}
			previewHeight_px={previewWidth / 1.77}
			bind:mediaErrorMessage
		>
			<div slot="loading">
				<Circle color="white" />
			</div>
			<div slot="failedToInitialize">
				<h2>Failed to start Camera</h2>
				Error: {mediaErrorMessage}
			</div>
		</QR>
	</div>
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;
	.qr-container {
		display: flex;
		justify-content: center;
		width: calc(100% + 4rem);
		height: calc(100% + 4rem);
		position: relative;
		left: -2rem;
		top: -2rem;
		.qr-wrapper {
			width: 100%;
			div {
				background-color: $background-backdrop;
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				color: $text-dark;
				flex-direction: column;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
			}
		}
	}
</style>
