<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import Scanner from '$lib/components/scanner/ScannerWrapper.svelte';
	import Button from '$lib/components/Button.svelte';
	import Table from '$lib/components/Table.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Card from '$lib/components/Card.svelte';
	import AttendeeDetails from '$lib/components/AttendeeDetails.svelte';

	import { attendeesTable } from '$lib/generateDataVis';
	import { createCheckIn, removeLatestCheckIn } from '$lib/api';
	import { attendeesSearchTerm, eventAttendees, selectedAttendee } from '$lib/store';

	import { get, Writable, writable } from 'svelte/store';
	import { fly, fade } from 'svelte/transition';

	let attendeesTableData;

	$: {
		// IMPORTANT: This console.log means that the entire block will reload when
		// the $selectedAttendee changes. This is a hack, and should be fixed later on.
		console.log('Selected Attendee', $selectedAttendee);

		attendeesTableData = attendeesTable($eventAttendees, $attendeesSearchTerm);
	}

	// $: selectedAttendeeCheckedIn = $selectedAttendee &&  $selectedAttendee.check_ins.length === 0;

	let leftBarState: 'ScanAny' | 'ValidateCovidPass' | 'CheckInSuccess' = 'ScanAny';
	let leftBarHighlighted: Writable<boolean> = writable(false);
	let leftBarHighlightedTimeout: NodeJS.Timeout;
	leftBarHighlighted.subscribe((highlight) => {
		if (highlight) {
			if (leftBarHighlightedTimeout) {
				clearTimeout(leftBarHighlightedTimeout);
			}
			leftBarHighlightedTimeout = setTimeout(() => {
				leftBarHighlighted.set(false);
			}, 500);
		}
	});
</script>

<AdminLayout
	cards={{
		left: { scroll: false, highlighted: $leftBarHighlighted },
		rightBottom: false,
		rightTop: false
	}}
>
	<div slot="left-bar" class="left-bar">
		{#if leftBarState === 'ValidateCovidPass'}
			<div class="header-text" out:fade in:fly={{ y: -200, duration: 1000, delay: 500 }}>
				Booking for <b>{$selectedAttendee.first_name} {$selectedAttendee.last_name}</b>
				<h2>Please Verify COVID Pass</h2>
			</div>
		{:else if leftBarState === 'ScanAny'}
			<div class="header-text" out:fade in:fly={{ y: -200, duration: 1000 }}>
				<h2>Scan a Booking or COVID Pass</h2>
			</div>
		{/if}
		<div class="scanner-container">
			<Scanner />
		</div>
		{#if leftBarState === 'ValidateCovidPass'}
			<div out:fade in:fly={{ y: 200, duration: 1000 }}>
				This will be a QR code provided by the government to verify eligibility for events. Scan
				using the webcam above to start.
			</div>

			<hr class="hr-or" out:fade in:fly={{ y: 200, duration: 500 }} />
		{:else if leftBarState === 'ScanAny'}
			<h2>Scan a booking or COVID pass to begin</h2>
			<div out:fade in:fly={{ y: 200, duration: 1000 }}>
				Not working or no code? Use the search to the right to bring up the attendee details and
				mark them as checked in.
			</div>
		{/if}
	</div>
	<div slot="left-bar-footer">
		{#if leftBarState === 'ValidateCovidPass'}
			<div out:fade in:fly={{ y: 200, duration: 1000 }}>
				<Button
					expanded
					on:click={() => {
						createCheckIn(get(selectedAttendee), true);
						leftBarState = 'ScanAny';
					}}
				>
					Skip and check in anyway
				</Button>
			</div>
		{/if}
	</div>
	<div slot="info-panel-header">
		<h2 class="pannel-header">Attendee Details</h2>
	</div>
	<div slot="info-panel" class="info-panel">
		<Card expand={true} scroll={true} background={!!$selectedAttendee}>
			{#if $selectedAttendee}
				<AttendeeDetails
					attendee={selectedAttendee}
					on:checkIn={() => {
						leftBarState = 'ValidateCovidPass';
						leftBarHighlighted.set(true);
					}}
					on:removeLatestCheckIn={() => {
						removeLatestCheckIn(get(selectedAttendee));
					}}
					on:moreDetails={() => {
						// TODO: Implement detailed attendee deatails page
					}}
				/>
			{:else if leftBarState === 'ScanAny'}
				<p class="noSelect">
					Scan a booking or COVID pass, or search attendees to access their details.
				</p>
			{/if}
		</Card>
	</div>
	<div slot="list-panel-header">
		<h2 class="pannel-header">Attendees</h2>
		<div class="search-container">
			<TextInput
				placeholder="Search for name, email, booking number, etc"
				expanded
				bind:textInputValue={$attendeesSearchTerm}
			/>
		</div>
	</div>
	<div slot="list-panel" class="table">
		<Table tableHeaders={attendeesTableData[0]} tableData={attendeesTableData[1]} />
	</div>
</AdminLayout>

<style lang="scss">
	@use '../../lib/styles/vars.scss' as *;

	.left-bar {
		text-align: center;
		height: 100%;
		position: relative;
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
			background-color: #cacaca;
			border: none;
			height: 2px;
			overflow: visible;
			position: absolute;
			width: 100%;
			bottom: 0;
		}
		.scanner-container {
			width: 100%;
			margin-bottom: 2em;
			position: relative;
			border-radius: 0.7rem;
			:global#cam-preview {
				border-radius: 0.7rem;
				transform: scale(0.98);
			}
			:global.dialog-container {
				border-radius: 0.7rem;
				transform: scale(0.98);
			}
		}
	}
	.pannel-header {
		display: block;
		color: $text-dark;
		margin: 0;
	}
	.info-panel {
		height: 100%;
		.noSelect {
			font-size: 2em;
			text-align: center;
			opacity: 40%;
			font-weight: 700;
			max-width: 700px;
			margin: auto;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			display: flex;
			align-items: center;
		}
	}
	.search-container :global(input),
	.table {
		border-radius: $radius-default;
		overflow: hidden;
	}
</style>
