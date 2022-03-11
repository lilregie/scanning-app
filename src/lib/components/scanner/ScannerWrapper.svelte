<script lang="ts">
	import { validateScan, ScanTypes } from '$lib/validateScan';
	import SuccessTick from '$lib/components/SuccessTick.svelte';
	import AttendeeMatching from '$lib/components/modal/AttendeeMatching.svelte';
	import { Tabs, TabList, TabPanel, Tab } from '$lib/components/tabs';

	import { get, writable } from 'svelte/store';

	import InvalidCross from '../InvalidCross.svelte';
	import CameraScanner from './CameraScanner.svelte';
	import TextScanner from './TextScanner.svelte';
	import { globalModalState, prefersCameraOrTextScanning } from '$lib/store';
	import { ScannerStatus } from './scannerStatus';
	import ScanResult from './ScanResult.svelte';
	import {bind} from "svelte-simple-modal";
import Button from '../Button.svelte';

	export let enabledScanTypes: ScanTypes = {
		ticketBarcode: true,
		nzCovidPass: true
	};

	let covidPassFailReason: string = '';

	let scannerStatus = writable(ScannerStatus.Scanning);

	async function handleScan(event: CustomEvent) {
		if (get(scannerStatus) === ScannerStatus.Scanning) {
			let validator = await validateScan(event.detail.qrContent, enabledScanTypes);
			if (validator.valid) {
				scannerStatus.set(ScannerStatus.ConfirmScan);

				// @ts-ignore
				setTimeout(()=>{globalModalState.set(bind(AttendeeMatching, { ...validator, vaccineCert: event.detail.qrContent }))},500);
			} else {
				scannerStatus.set(ScannerStatus.Invalid);
				covidPassFailReason = validator.violates;
			}
		}
	}

	let previewWidth;

	let cameraScannerClientHeight: number;
	let textScannerClientHeight: number;

	let permissionForCameraState: PermissionState | null = null;
	(async ()=>{
		try {
			let status = await navigator.permissions.query({name: 'camera' as PermissionName});
			permissionForCameraState = status.state;
		} catch {
			permissionForCameraState = "denied";
		}
	})();

	function promptCameraPermission() {
		// Prompts user to grant camera permission
		navigator.mediaDevices.getUserMedia({ audio: false, video: true});
		// Assume everything went well, so they can see the full error
		// Avoids situations where the button does nothing on non-compliant browsers
		permissionForCameraState = "granted";
	}
</script>

<div class="qr-container">
	<!-- Always render QR Scanner we enabled (so we hide it instead of remove it) -->
	<div
		class="qr-wrapper"
		bind:clientWidth={previewWidth}
		style="--fail-response-height: {textScannerClientHeight || cameraScannerClientHeight || previewWidth / 1.77}px"
	>
		<Tabs defualtTab={$prefersCameraOrTextScanning}>
			<TabList>
				<Tab id="camera" on:selected={() => prefersCameraOrTextScanning.set('camera')}>Camera</Tab>
				<Tab id="text" on:selected={() => prefersCameraOrTextScanning.set('text')}>Text</Tab>
			</TabList>
			<TabPanel id="camera">
				{#if permissionForCameraState === "granted"}
					<CameraScanner
						on:scan={handleScan}
						{previewWidth}
						bind:clientHeight={cameraScannerClientHeight}
					/>
				{:else if permissionForCameraState === "prompt"}
					<div class="permission-container">
						<span class="permission-header">To scan, we need to use your camera</span>
						<span class="permission-instructions">Select <b>Allow</b> when your browser asks for permissions.</span>
						<Button color="primary" outline size="small" on:click={promptCameraPermission}>Give Permission</Button>
					</div>
				{:else if permissionForCameraState === "denied"}
					<div class="permission-container">
						<span class="permission-header">Camera Permission Denied</span>
						<span>To use your camera, you will need to grant permission to use your camera with your browser.</span>
					</div>
				{/if}
			</TabPanel>
			<TabPanel id="text">
				<TextScanner
					on:scan={handleScan}
					{previewWidth}
					bind:clientHeight={textScannerClientHeight}
					{scannerStatus}
				/>
			</TabPanel>
		</Tabs>
		{#if $scannerStatus === ScannerStatus.ConfirmScan}
			<ScanResult bind:scannerStatus backgroundColour="#2ba628">
					<div style="width: 30%">
						<SuccessTick />
					</div>
					COVID Pass Verified
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
			width: 100%;
			.invalid-cross-wrapper {
				:global(svg) {
					width: 6em;
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
					font-size: 1.5rem;
					font-weight: bold;
					margin-bottom: 1rem;
				}
				.permission-instructions {
					margin-bottom: 1rem;
				}
			}
		}
	}
</style>
