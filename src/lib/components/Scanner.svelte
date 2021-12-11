<script lang="ts">
	import { validateScan, ScanTypes } from '$lib/validateScan';
	import Tick from '$lib/components/Tick.svelte';
	import AttendeeMatching from '$lib/components/modal/AttendeeMatching.svelte';


	import QR from 'modern-svelte-qr-scanner';
	import { Circle } from 'svelte-loading-spinners';
	
	import { get, writable } from 'svelte/store';
	import { fly, fade } from 'svelte/transition';
	import { getContext } from "svelte";

	export let enabledScanTypes: ScanTypes = {
		ticketBarcode: true,
		nzCovidPass: true
	};

	const { open } = getContext('simple-modal');

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

	async function handleScan(event: CustomEvent) {
		if (get(scannerStatus) === ScannerStatus.Scanning) {
			let validator = await validateScan(event.detail.qrContent, enabledScanTypes);
			if (validator.valid) {
				open(AttendeeMatching,{...validator});
			}
			// scannerStatus.set(ScannerStatus.ConfirmScan);
		}
	}

	let previewWidth;
	let mediaErrorMessage = '';
</script>

<div class="qr-container">
	<!-- Always render QR Scanner we enabled (so we hide it instead of remove it) -->
	<div class="qr-wrapper" bind:clientWidth={previewWidth}>
		{#if $scannerStatus === ScannerStatus.ConfirmScan}
			<div class="comfirm" in:fade={{ duration: 150 }} out:fly>
				<div style="width: 30%">
					<Tick />
				</div>
				COVID Pass Verified
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
	@use 'sass:map';

	.qr-container {
		display: flex;
		justify-content: center;
		.qr-wrapper {
			width: 100%;
			> div {
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
			.comfirm {
				background-color: map.get($theme-colors, 'success');
			}
			.fail {
				background-color: map.get($theme-colors, 'alert');
			}
		}
	}
</style>
