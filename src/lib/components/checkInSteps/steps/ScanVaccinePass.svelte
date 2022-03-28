<script lang="ts">

	import { createEventDispatcher } from 'svelte';

	import Scanner from '$lib/components//scanner/ScannerWrapper.svelte';
	import StepLayout from '../StepLayout.svelte';

	import { ScanTypes, type NZCovidPass } from '$lib/components/scanner/validateScan';
	import type { ScanResults } from '$lib/components/scanner/validateScan';
	import CovidPassBadge from '$lib/components/CovidPassBadge.svelte';


	const dispatch = createEventDispatcher();

	function next() {
		dispatch('next');
	}
	function scan(event) {
		let data = event.detail as ScanResults;
		if (!data.valid || data.data.type !== ScanTypes.CovidPass) {
			covidPassInfo = null;
			return
		}

		covidPassInfo = data.data;
	}

	let covidPassInfo: NZCovidPass = null;
</script>

<StepLayout stageCompleted={Boolean(covidPassInfo)} on:next={next} on:skip on:back>
	<div class="scanner-wrapper">
		<Scanner enabledScanTypes={[ScanTypes.CovidPass]} on:scan-complete={scan}/>
	</div>
	{#if covidPassInfo}
		<CovidPassBadge data={covidPassInfo} />
	{/if}
</StepLayout>

<style lang="scss">
	.scanner-wrapper {
		width: 80%;
		margin: 0 auto;
	}
</style>
