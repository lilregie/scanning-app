<script lang="ts">
	import QR from 'modern-svelte-qr-scanner';

	let previewWidth;
	let mediaErrorMessage = '';

	function onQRScan(event: CustomEvent) {
		alert(event.detail.qrContent);
	}
</script>

<div class="qr-container">
	<div class="qr-wrapper" bind:clientWidth={previewWidth}>
		<QR
			on:scan={onQRScan}
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
</div>
