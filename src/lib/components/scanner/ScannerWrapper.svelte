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

	export let enabledScanTypes: ScanTypes[] = [ScanTypes.TicketBarcode, ScanTypes.CovidPass];

	let covidPassFailReason: string = '';

	let scannerStatus = writable(ScannerStatus.Scanning);

	const dispatch = createEventDispatcher();

	async function handleScan(event: CustomEvent) {
		if (get(scannerStatus) === ScannerStatus.Scanning) {
			let validator = await validateScan(event.detail.qrContent, enabledScanTypes);
			if (validator.valid === true) {
				const type = validator.data.type;
				if (type === ScanTypes.CovidPass) {
					scannerStatus.set(ScannerStatus.SuccessCovidPass);
				} else if (type === ScanTypes.TicketBarcode) {
					scannerStatus.set(ScannerStatus.SuccessTicket);
				}
				dispatch('scan-complete', validator);
			} else {
				scannerStatus.set(ScannerStatus.Invalid);
				covidPassFailReason = validator.violation;
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
			// API not supported by Safari on both desktop and mobile
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
			<CameraScanner on:scan={handleScan} {previewWidth} />
		{:else if permissionForCameraState === 'prompt'}
			<div class="permission-container">
				<span class="permission-header">To scan, we need to use your camera</span>
				<span class="permission-instructions">
					Select <b>Allow</b> when your browser asks for permissions.
				</span>
				<Button
					color="primary"
					size="small"
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
					size="small"
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
					size="small"
					on:click={promptCameraPermission}
				>
					Start
				</Button>
			</div>
		{/if}
		{#if $scannerStatus === ScannerStatus.SuccessCovidPass}
			<ScanResult bind:scannerStatus backgroundColour="#2ba628">
				<div style="width: 30%">
					<SuccessTick />
				</div>
				COVID Pass Verified
			</ScanResult>
		{:else if $scannerStatus === ScannerStatus.SuccessTicket}
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
				{covidPassFailReason}
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
			text-align: center;
			width: 100%;
			max-width: 50svh;

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
			color: $text-dark;
			background-color: $background-backdrop;
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
