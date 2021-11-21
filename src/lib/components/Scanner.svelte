<script lang="ts">
	import QR from 'modern-svelte-qr-scanner';

	import { get, writable } from 'svelte/store';


	enum ScannerStatus {
		Scanning,
		SuccessMessage,
		FailMessage
	}
	let scannerStatus = writable(ScannerStatus.Scanning)
	scannerStatus.subscribe((status)=>{
		if (status!==ScannerStatus.Scanning) {
			setTimeout(()=>{
				scannerStatus.set(ScannerStatus.Scanning)
			},10000)
		}
	})

	function handleScan() {
		if (get(scannerStatus)===ScannerStatus.Scanning) {
			scannerStatus.set(ScannerStatus.SuccessMessage)
		}
	}

	let previewWidth;
	let mediaErrorMessage = '';
</script>
<div class="qr-container">
	<!-- Always render QR Scanner we enabled (so we hide it instead of remove it) -->
	<div class="qr-wrapper" bind:clientWidth={previewWidth} hidden={$scannerStatus!==ScannerStatus.Scanning}>
		<QR
			on:scan={handleScan}
			previewWidth_px={previewWidth}
			previewHeight_px={previewWidth}
			bind:mediaErrorMessage
		>
			<div slot="loading" class="loading">
				<span>Loading Animation, but text</span>
			</div>
			<div slot="failedToInitialize" class="failed-to-initialize">
				Failed to initialize camera.<br />
				Error: {mediaErrorMessage}
			</div>
		</QR>
	</div>
	{#if $scannerStatus===ScannerStatus.SuccessMessage}
	{:else if $scannerStatus===ScannerStatus.FailMessage}
	{/if}
</div>
<style lang="scss">
	.qr-container {
		display: flex;
		justify-content: center;
		width: 100%;
		.qr-wrapper {
			width: 75%;
		}
	}
</style>
