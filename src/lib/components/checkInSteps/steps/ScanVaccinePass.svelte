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
	import type { TableRow } from '$lib/components/Table.svelte';
	import Button from '$lib/components/Button.svelte';
import { currentEvent, globalModalState } from '$lib/store';
import StepWarning from '../StepWarning.svelte';
import AttendeeMatching from '$lib/components/modal/AttendeeMatching.svelte';
import { bind } from 'svelte-simple-modal';


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
			stageState = covidPassNameMatch($covidPass, $attendeeProfile.attendee) ? StageState.Complete : StageState.Warning;
		}
	}

	function covidPassNameMatch(pass: NZCovidPass | null,  attendee: Attendee | null) {
		// Can't match if it is a ticket only event
		if ($currentEvent?.event_type === "ticket_only") {
			return true;
		}
		
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

	function findAttendeeFromPass() {
		globalModalState.set(bind(AttendeeMatching, { data: $covidPass }))
	}

	onMount(() => {
		covidPass.set($memory);
	});
</script>
<div class="scanner-container">
	<div class="scanner-wrapper">
		<Scanner enabledScanTypes={[ScanTypes.CovidPass]} on:scan-complete={scan} />
		{#if $covidPass}
			<CovidPassBadge
				data={$covidPass}
				icon={stageState === StageState.Warning ? 'warning' : 'tick'}
			/>
		{/if}
	</div>
	
	{#if stageState === StageState.Warning}
		<StepWarning>
			<svelte:fragment slot="title">Warning</svelte:fragment>
			<svelte:fragment slot="message">The name on this pass does not match selected Attendee.</svelte:fragment>
			<!-- <svelte:fragment slot="table">
				<Table
				tableHeaders={nameMissmatchTableData[0]}
				tableData={nameMissmatchTableData[1]}
				tableColumnLine
			/>
			</svelte:fragment> -->
			<svelte:fragment slot="actions">
				<Button on:click={findAttendeeFromPass} color="success">
					Find {nameMissmatchTableData[1][0].data[1]}
				</Button>
			</svelte:fragment>
		</StepWarning>
	{/if}
</div>


<style lang="scss">
	.scanner-container {
		max-width: 50em;
		margin: 0 auto 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 98%;
	}

</style>
