<script lang="ts">
	import type { Readable } from 'svelte/store';
	import type { Attendee } from '$lib/attendee';

	import Button from '$lib/components/Button.svelte';
	import SuccessTick from '$lib/components/SuccessTick.svelte';
	import FullAttendeeDetails from '$lib/components/modal/FullAttendeeDetails.svelte';
	import InvalidCross from './InvalidCross.svelte';

	import { currentEvent, globalModalState, selectedAttendee, selectedEventletIDs } from '$lib/store';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { writable } from 'svelte/store';
	import { bind } from 'svelte-simple-modal';
	import CloseButton from './CloseButton.svelte';
	import EventletBox from './eventlet/EventletBox.svelte';

	export let attendee: Readable<Attendee>;
	export let direction: 'horizontal' | 'vertical' = 'horizontal';
	export let actionsAvailable: boolean = true;
	export let closeable: boolean = false;

	// Live updating checklist for attendee
	let checkedIn = false;
	let checkList = {};
	$: {
		checkList = {
			'Booking Found': $attendee?.booking_id,
			'COVID Pass Verified': $attendee?.vaccine_pass
		};
		// jankly adding in `Not` if not checked in
		checkedIn = $attendee?.checked_in_at !== null;
		checkList[checkedIn ? 'Checked In' : 'Not Checked In'] = checkedIn;
	}

	function checkIn() {
		dispatch('checkIn', {});
	}

	function removeLatestCheckIn() {
		dispatch('removeLatestCheckIn', {});
	}

	function moreDetails() {
		dispatch('moreDetails', {});
		// @ts-expect-error
		globalModalState.set(bind(FullAttendeeDetails, { attendee: attendee }));
	}

	// Detail level manager
	let detailLevel = writable(0);
	let elementWidth = 0;

	$: maxDetailLevel = $currentEvent?.standalone ? 2 : 3;

	$: {
		if (direction === 'horizontal') {
			// 250px needed per column to stop overflow
			let calculatedSpacing = Math.floor(elementWidth / 250);

			// Limit the details colums, so there is at least the name, and a max of the number of details
			let newDetailLevel = Math.min(Math.max(calculatedSpacing, 1), maxDetailLevel);

			detailLevel.set(newDetailLevel);
		}
	}
	$: {
		if (direction === 'vertical') {
			detailLevel.set(maxDetailLevel);
		}
	}

</script>

{#if closeable}
	<CloseButton on:close altText="Close Attendee Details" spacing={['0', '0']} />
{/if}

<div
	class="details-container"
	class:horizontal={direction === 'horizontal'}
	class:vertical={direction === 'vertical'}
	style="--detailLevel: {$detailLevel}"
	bind:clientWidth={elementWidth}
>
	{#if $selectedAttendee}
		<div class="detail-column">
			<h2 class="attendee-name">
				{$attendee?.first_name}
				{$attendee?.last_name}
			</h2>
			<div class="attendee-org">
				{$attendee?.organisation || ''}&nbsp;
			</div>
			<div class="check-list">
				{#each Object.entries(checkList) as check}
					<div class="check-item">
						<span class="check-status">
							{#if check[1]}
								<SuccessTick colour="#2ba628" />
							{:else}
								<InvalidCross colour="#d0021b" />
							{/if}
						</span>
						<span class="check-item-label">{check[0]}</span>
					</div>
				{/each}
			</div>
		</div>
		{#if $detailLevel > 1}
			<div class="detail-column">
				<h3 class="detail-group-header">Requirements</h3>
				{#if $attendee?.requirements}
					{$attendee.requirements}
				{:else}
					<span class="detail-missing">No Requirements Found</span>
				{/if}
				<h3 class="detail-group-header">Booking Details</h3>
				{#if $attendee?.email_address}
					<div class="detail-key-value">
						<span class="detail-key">Email</span>
						<span class="detail-value">{$attendee.email_address}</span>
					</div>
				{/if}
				{#if $attendee?.contact_phone}
					<div class="detail-key-value">
						<span class="detail-key">Phone</span>
						<span class="detail-value">{$attendee.contact_phone}</span>
					</div>
				{/if}
				{#if $attendee?.ticket_type_name}
					<div class="detail-key-value">
						<span class="detail-key">Ticket Type</span>
						<span class="detail-value">{$attendee.ticket_type_name}</span>
					</div>
				{/if}
				{#if $attendee?.custom_fields?.length > 0}
					<h3 class="detail-group-header">Custom Fields</h3>
					<div class="detail-key-value">
						<div class="custom-fields">
							{#each $attendee.custom_fields as field}
								<span class="detail-key">{field.name}</span>
								<div class="detail-key-value">
									{#each field.values as value}
										<span class="detail-value custom-fields-multiple">{value}</span>
									{/each}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{/if}
		{#if $detailLevel > 2 && !$currentEvent?.standalone}
			<div class="detail-column">
				<h3 class="detail-group-header">Bookings</h3>
				{#if $attendee?.attendances.length > 0}
				<div class="bookings-container">
					{#each $attendee.attendances.sort((a,b)=>(a.eventlet_name > b.eventlet_name)?1:-1) as attendance}
						<EventletBox eventletId={attendance.eventlet_id}/>
					{/each}
				</div>
				{:else}
					<span class="detail-missing">No Bookings Found</span>
				{/if}
			</div>
		{/if}
	{/if}
</div>
{#if actionsAvailable}
	<div class="action-container">
		{#if checkedIn}
			<Button on:click={removeLatestCheckIn} color="warning">Remove Check In</Button>
		{:else}
			<Button on:click={checkIn}>Check In</Button>
		{/if}
		{#if $detailLevel < maxDetailLevel}
			<Button on:click={moreDetails} color="secondary" outline>More Details</Button>
		{/if}
	</div>
{/if}

<style lang="scss">
	@use '../styles/vars.scss' as *;
	@use '../styles/functions.scss' as *;
	@use 'sass:list';

	.details-container {
		&.horizontal {
			display: grid;
			flex-direction: row;
			grid-template-columns: repeat(var(--detailLevel), 1fr);
			grid-template-rows: 1fr;
			margin-bottom: 1rem;
			box-sizing: border-box;
			list-style: none;
			.detail-column {
				&:not(&:first-of-type) {
					border-left: solid 1px black;
				}
			}
		}
		&.vertical {
			.detail-column {
				margin-bottom: 1rem;
			}
		}

		.detail-column {
			position: relative;
			padding: 0 0 0 1rem;
			&:first-of-type {
				padding-left: 0;
			}
			.attendee-name {
				font-size: 2rem;
				font-weight: bold;
			}
			.attendee-org {
				font-size: 1.25rem;
				font-weight: normal;
			}
			.detail-group-header {
				font-size: 1.5rem;
				font-weight: bold;
			}
			.detail-missing {
				color: #999;
			}
			h2,
			h3 {
				margin: 0 0 0.25em 0;
			}
			.check-list {
				.check-item {
					font-size: 1.15rem;
					font-weight: bold;
					.check-status {
						:global(svg) {
							width: 1em;
							display: inline;
							vertical-align: bottom;
						}
					}
				}
			}

			.detail-key {
				font-weight: bold;
				&::after {
					content: ': ';
				}
			}
			.custom-fields-multiple {
				margin-left: 1rem;
				&::before {
					content: '- ';
				}
				display: block;
			}

			.bookings-container {
				$spacing: 0.5em;
				position: relative;
				display: flex;
				flex-wrap: wrap;
				top: -$spacing;
				left: -$spacing;
				:global(div) {
					margin: $spacing;
				}
				
			}
		}
	}

	.action-container {
		position: absolute;
		bottom: 0;
	}
</style>
