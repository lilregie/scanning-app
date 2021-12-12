<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import Scanner from '$lib/components/Scanner.svelte';
	import Button from '$lib/components/Button.svelte';
	import Table from "$lib/components/Table.svelte";
	import Search from '$lib/components/Search.svelte';
	import Card from '$lib/components/Card.svelte';
	import AttendeeDetail from '$lib/components/AttendeeDetail.svelte';

	import { attendeesTable } from '$lib/generateDataVis';
	import { createCheckIn } from '$lib/api';
	import { attendeesSearchTerm, eventAttendees, selectedAttendee } from "$lib/store";

	import { get } from 'svelte/store';

	let attendeesTableData;

	$: {
		// IMPORTANT: This console.log means that the entire block will reload when 
		// the $selectedAttendee changes. This is a hack, and should be fixed later on.
		console.log("Selected Attendee",$selectedAttendee.id);

		attendeesTableData = attendeesTable($eventAttendees, $attendeesSearchTerm);
	}

	// $: selectedAttendeeCheckedIn = $selectedAttendee &&  $selectedAttendee.check_ins.length === 0;

	let leftBarState: "ScanAny" | "ValidateCovidPass" | "CheckInSuccess" = "ScanAny";
</script>

<AdminLayout cards={{
	left: {scroll: false},
	rightBottom: false,
	rightTop: false,
}}>
	<div slot="left-bar" class="left-bar">
		{#if leftBarState==="ValidateCovidPass"}
			<div class="header-text">
				Booking for <b>{$selectedAttendee.first_name} {$selectedAttendee.last_name}</b>
				<h2>Please Verify COVID Pass</h2>
			</div>
		{:else if leftBarState==="ScanAny"}
			<div class="header-text">
				<h2>Scan a Booking or COVID Pass</h2>
			</div>
		{/if}
		<div class="scanner-container">
			<Scanner />
		</div>
		{#if leftBarState==="ValidateCovidPass"}
			<span>
				This will be a QR code provided by the government to verify eligibility for events. Scan
				using the webcam above to start.
			</span>

			<hr class="hr-or" />
		{:else if leftBarState==="ScanAny"}
			Scan a booking or COVID pass, or search attendees to access their details
		{/if}

		

	</div>
	<div slot="left-bar-footer">
		{#if leftBarState==="ValidateCovidPass"}
			<Button size="expanded" on:click={()=>{
				console.log("Checking In")
				createCheckIn(get(selectedAttendee),true)
				leftBarState = "ScanAny"
			}
			}>Skip and check in anyway</Button>
		{/if}
	</div>
	<div slot="info-panel-header">
		<h2 class="pannel-header">Attendee details</h2>
	</div>
	<div slot="info-panel" class="info-panel">
		<Card expand={true} scroll={true} >
			{#if $selectedAttendee}
				<AttendeeDetail attendee={$selectedAttendee} on:checkIn={()=>{
					leftBarState = "ValidateCovidPass"
				}}/>
			{:else if leftBarState==="ScanAny"}
				Scan a booking or COVID pass, or search below to view attendee details 
			{/if}
		</Card>


	</div>
	<div slot="list-panel-header">
		<h2 class="pannel-header">Attendees</h2>
		<div class="search-container">
			<Search placeholder="Search for name, email, booking number, etc" size="expanded" bind:searchTerm={$attendeesSearchTerm}></Search>
		</div>
	</div>
	<div slot="list-panel">
		<Table tableHeaders={attendeesTableData[0]} tableData={attendeesTableData[1]}/>
	</div>
</AdminLayout>

<style lang="scss">
	@use '../../lib/styles/vars.scss' as *;

	.left-bar {
		text-align: center;
		height: 100%;
		position:relative;
		.header-text {
			h2 {
				font-size: 2rem;
				margin: 1rem;
			}
		}
		.hr-or {
			&::after {
				content: 'OR';
				position: relative;
				top: -0.5rem;
				background-color: $background-foreground;
				padding: 0 1.5em;
				box-sizing: border-box;
			}
			background-color: #CACACA;
			border: none;
			height: 2px;
			overflow: visible;
			position: absolute;
			width: 100%;
			bottom: 0;
		}
		.scanner-container {
			width: calc(100% + 4rem);
			margin-bottom: 2em;
			position: relative;
			left: -2rem;
		}
	}
	.pannel-header {
		display: block;
		color: $text-dark;
		margin: 0;
	}
	.info-panel {
		height: 100%;
	}
</style>
