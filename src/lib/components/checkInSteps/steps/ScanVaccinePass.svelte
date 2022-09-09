<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	import Scanner from '$lib/components//scanner/ScannerWrapper.svelte';
	import StepLayout from '../StepLayout.svelte';

	import { ScanTypes, type NZCovidPass } from '$lib/components/scanner/validateScan';
	import type { ScanResults } from '$lib/components/scanner/validateScan';
	import CovidPassBadge from '$lib/components/CovidPassBadge.svelte';
	import { StageState, type AttendeeProfile } from '../stepManager';
	import { writable, type Writable } from 'svelte/store';
	import { normString, titleCase } from '$lib/utill';
	import Table, { type TableRow } from '$lib/components/Table.svelte';
	import Button from '$lib/components/Button.svelte';

	export let attendeeProfile: Writable<AttendeeProfile>;
	export let memory: Writable<NZCovidPass>;
	export let stageState: StageState = StageState.Incomplete;

	const covidPass: Writable<NZCovidPass | null> = writable(null);
	// On step load, it will remove any previous covid pass scans
	// TODO: Add UI and skip step if the attendee has already checked there covid pass
	$: $attendeeProfile.covidPass = $attendeeProfile.covidPass || Boolean($covidPass);

	const desubMemory = covidPass.subscribe((value) => {
		if (value) {
			memory.set(value);
		}
	});

	const dispatch = createEventDispatcher();

	function scan(event: { detail: ScanResults }) {
		let data = event.detail;
		if (!data.valid || data.data.type !== ScanTypes.CovidPass) {
			$covidPass = null;
			return;
		}

		$covidPass = data.data;
	}

	$: {
		if (!$covidPass) {
			stageState = StageState.Incomplete;
		} else {
			stageState = covidPassNameMatch() ? StageState.Complete : StageState.Warning;
		}
	}

	function covidPassNameMatch() {
		const pass = $covidPass;
		const attendee = $attendeeProfile.attendee;

		if (!pass || !attendee) {
			return false;
		}

		const [attendeeFullName, covidPassFullName] = normalisedNamesFromPass(pass, attendee);

		return covidPassFullName === attendeeFullName;
	}
	function normalisedNamesFromPass(pass: NZCovidPass | null, attendee: Attendee | null): [string, string] {
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

	$: normalisedNames = normalisedNamesFromPass($covidPass, $attendeeProfile.attendee);
	// For name mismatch warning dialog
	let nameMissmatchTableData: [string[], TableRow[]] = [[], []];
	$: {
		nameMissmatchTableData = [
			['Attendee', 'Covid Pass'],
			[{ data: normalisedNames.map((x) => titleCase(x)) }]
		];
	}

	onMount(() => {
		covidPass.set($memory);
	});
</script>

<div class="scanner-wrapper">
	<Scanner enabledScanTypes={[ScanTypes.CovidPass]} on:scan-complete={scan} />
	{#if $covidPass}
		<CovidPassBadge
			data={$covidPass}
			icon={stageState === StageState.Warning ? 'tick' : 'warning'}
		/>
	{/if}
</div>

{#if stageState === StageState.Warning}
	<div class="missmatch-warning">
		<div class="message">
			<h3>Warning</h3>
			<span>The name on this pass does not match selected Attendee.</span>
		</div>
		<div class="table">
			<Table
				tableHeaders={nameMissmatchTableData[0]}
				tableData={nameMissmatchTableData[1]}
				tableColumnLine
			/>
		</div>
		<div class="actions">
			<Button color="secondary" on:click={() => (stageState = StageState.Incomplete)}>Cancel</Button
			>
			<Button color="warning" on:click={() => dispatch('force')}>Force</Button>
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../../styles/vars.scss' as *;
	@use 'sass:map';

	.scanner-wrapper {
		max-width: 50em;
		margin: 0 auto;
	}
	.missmatch-warning {
		z-index: 10;
		width: calc(100% - 1rem);
		margin: auto;
		left: 0;
		right: 0;
		box-sizing: border-box;

		padding: 1em;
		font-size: 1.2rem;

		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background-color: $background-foreground;

		box-shadow: map-get($shadows, 'medium');

		display: grid;
		grid-template:
			'message table' auto
			'action action' auto;

		border: 2px solid map-get($theme-colors, 'warning');
		border-radius: $radius-default;

		h3 {
			margin: 0;
		}

		.actions {
			display: flex;
			justify-content: right;
			margin-top: 1em;
			grid-area: action;
			column-gap: 0.5rem;
		}
		.message {
			grid-area: message;
		}
		.table {
			grid-area: table;
		}
	}
</style>
