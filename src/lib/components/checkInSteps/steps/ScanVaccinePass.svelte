<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import { createEventDispatcher } from 'svelte';

	import Scanner from '$lib/components//scanner/ScannerWrapper.svelte';
	import StepLayout from '../StepLayout.svelte';

	import { ScanTypes, type NZCovidPass } from '$lib/components/scanner/validateScan';
	import type { ScanResults } from '$lib/components/scanner/validateScan';
	import CovidPassBadge from '$lib/components/CovidPassBadge.svelte';
	import { StageState, type AttendeeProfile } from '../stepManager';
	import type { Writable } from 'svelte/store';
	import { normString, titleCase } from '$lib/utill';
	import Table, { type TableRow } from '$lib/components/Table.svelte';

	export let attendeeProfile: Writable<AttendeeProfile>;
	export let lastStep: boolean;

	const dispatch = createEventDispatcher();

	function next() {
		dispatch('next');
	}
	function scan(event: { detail: ScanResults; }) {
		let data = event.detail;
		if (!data.valid || data.data.type !== ScanTypes.CovidPass) {
			$attendeeProfile.covidPassInfo = null;
			return;
		}

		$attendeeProfile.covidPassInfo = data.data;
	}

	let stageState: StageState = StageState.Incomplete;

	$: {
		if (!$attendeeProfile.covidPassInfo) {
			stageState = StageState.Incomplete;
		} else {
			stageState = covidPassNameMatch() ? StageState.Complete : StageState.Warning;
		}
	}

	function covidPassNameMatch() {
		const pass = $attendeeProfile.covidPassInfo;
		const attendee = $attendeeProfile.attendee;

		if (!pass || !attendee) {
			return false;
		}

		const [attendeeFullName, covidPassFullName] = normalisedNamesFromPass(pass, attendee);

		return covidPassFullName === attendeeFullName;
	}
	function normalisedNamesFromPass(pass: NZCovidPass, attendee: Attendee): [string, string] {
		if (!pass || !attendee) {
			return ['', ''];
		}

		// Usually the given name includes a middle name, so we split that out
		// into just a first name
		const covidPassFirstName = pass.givenName.split(' ')[0];
		const covidPassFullName = normString(`${covidPassFirstName} ${pass.lastName}`);
		const attendeeFullName = normString(`${attendee.first_name} ${attendee.last_name}`);

		return [attendeeFullName, covidPassFullName];
	}

	$: normalisedNames = normalisedNamesFromPass(
		$attendeeProfile.covidPassInfo,
		$attendeeProfile.attendee
	);
	// For name mismatch warning dialog
	let nameMissmatchTableData: [string[], TableRow[]] = [[], []];
	$: {
		nameMissmatchTableData = [
			['Attendee', 'Covid Pass'],
			[{ data: normalisedNames.map((x) => titleCase(x)) }]
		];
	}
</script>

<StepLayout {stageState} on:next={next} on:skip on:back on:force={next} {lastStep}>
	<div class="scanner-wrapper">
		<Scanner enabledScanTypes={[ScanTypes.CovidPass]} on:scan-complete={scan} />
		{#if $attendeeProfile.covidPassInfo}
			<CovidPassBadge
				data={$attendeeProfile.covidPassInfo}
				icon={stageState === StageState.Warning ? 'tick' : 'warning'}
			/>
		{/if}
	</div>

	{#if stageState === StageState.Warning}
		<span class="missmatch-warning">
			<strong>Warning:</strong> The name on this pass does not match selected Attendee.
			<Table tableHeaders={nameMissmatchTableData[0]} tableData={nameMissmatchTableData[1]} />
		</span>
	{/if}
</StepLayout>

<style lang="scss">
	.scanner-wrapper {
		max-width: 50em;
		margin: 0 auto;
	}
	.missmatch-warning {
		font-size: 1.2rem;
		position: absolute;
		bottom: 1em;
	}
</style>
