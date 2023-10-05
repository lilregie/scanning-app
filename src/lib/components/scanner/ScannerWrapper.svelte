<script lang="ts">
	import { ScanTypes, validateScan } from '$lib/components/scanner/validateScan';
	import SuccessTick from '$lib/components/SuccessTick.svelte';
	import { get, writable } from 'svelte/store';
	import InvalidCross from '../InvalidCross.svelte';
	import CameraScanner from './CameraScanner.svelte';
	import { ScannerStatus } from './scannerStatus';
	import ScanResult from './ScanResult.svelte';
	import Button from '../Button.svelte';
	import { createEventDispatcher } from 'svelte';

	let failReason: string = '';

	let scannerStatus = writable(ScannerStatus.Scanning);

	const dispatch = createEventDispatcher();

	async function handleScan(event: CustomEvent) {
		if (get(scannerStatus) === ScannerStatus.Scanning) {
			let scanResult = validateScan(event.detail.qrContent);

			if (scanResult.valid === true) {
				scannerStatus.set(ScannerStatus.SuccessTicket);
				dispatch('scan-complete', scanResult);
			} else {
				scannerStatus.set(ScannerStatus.Invalid);
				failReason = scanResult.violation;
			}
		}
	}
	let fullBrowserWidth: number;

	let previewWidth: number;
	$: previewWidthRatio = fullBrowserWidth < 650 ? 1 : 1.77;

	let permissionForCameraState: PermissionState | null | 'unknown' = null;
	(async () => {
		try {
			let status = await navigator.permissions.query({ name: 'camera' as PermissionName });
			permissionForCameraState = status.state;
		} catch {
			// 'camera' not supported by Firefox on both desktop and mobile
			// So we can just assume it's not allowed, as there are no alternative options
			// https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query#browser_compatibility
			permissionForCameraState = 'unknown';
		}
	})();

	function promptCameraPermission() {
		// Prompts user to grant camera permission
		navigator.mediaDevices.getUserMedia({ audio: false, video: true });
		// Assume everything went well, so they can see the full error
		// Avoids situations where the button does nothing on non-compliant browsers
		permissionForCameraState = 'granted';
	}
</script>

<svelte:window bind:innerWidth={fullBrowserWidth} />

<div class="qr-container">
	<div
		class="qr-wrapper"
		bind:clientWidth={previewWidth}
		style="--fail-response-height: {previewWidth / previewWidthRatio}px"
	>
		{#if permissionForCameraState === 'granted'}
			<CameraScanner on:scan={handleScan} />
		{:else if permissionForCameraState === 'prompt'}
			<div class="permission-container">
				<span class="permission-header">To scan, we need to use your camera</span>
				<span class="permission-instructions">
					Select <b>Allow</b> when your browser asks for permissions.
				</span>
				<Button
					color="primary"
					size="large"
					on:click={promptCameraPermission}
				>
					Give Permission
				</Button>
			</div>
		{:else if permissionForCameraState === 'denied'}
			<div class="permission-container">
				<span class="permission-header">Camera Permission Denied</span>
				<span class="permission-instructions">
					You will need to grant permission to use your camera with your browser.
				</span>
				<Button
					color="primary"
					size="large"
					on:click={promptCameraPermission}
				>
					Try Continue Anyway
				</Button>
			</div>
		{:else if permissionForCameraState === 'unknown'}
			<div class="permission-container">
				<span class="permission-header">Start Camera</span>
				<span class="permission-instructions">
					If prompted, select <b>Allow</b> when your browser asks for permissions.
				</span>
				<Button
					color="primary"
					size="large"
					on:click={promptCameraPermission}
				>
					Start
				</Button>
			</div>
		{/if}
		{#if $scannerStatus === ScannerStatus.SuccessTicket}
			<ScanResult bind:scannerStatus backgroundColour="#2ba628">
				<div style="width: 30%">
					<SuccessTick />
				</div>
				Ticket Verified
			</ScanResult>
		{:else if $scannerStatus === ScannerStatus.Invalid}
			<ScanResult bind:scannerStatus backgroundColour="#911d14">
				<div class="invalid-cross-wrapper">
					<InvalidCross colour="#fff" />
				</div>
				{failReason}
			</ScanResult>
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../../styles/vars.scss' as *;
	@use 'sass:map';

	.qr-container {
		display: flex;
		justify-content: center;

		.qr-wrapper {
			aspect-ratio: 1 / 1;
			background: #D9D9D9;
			border-radius: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: hidden;
			text-align: center;
			width: 480px;
			max-height: 50dvh;
			max-width: 100%;

			.invalid-cross-wrapper {
				:global(svg) {
					width: 6em;
				}
			}
		}

		.permission-container {
			height: var(--fail-response-height);
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			color: $text-light;
			padding: 0 1em;

			.permission-header {
				font-size: 1.25rem;
				font-weight: bold;
				margin-bottom: 1rem;
			}

			.permission-instructions {
				margin-bottom: 1rem;
				font-size: 1rem;
			}
		}
	}
</style>
