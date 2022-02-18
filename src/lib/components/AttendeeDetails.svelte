<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import SuccessTick from '$lib/components/SuccessTick.svelte';

	import type { Attendee } from '$lib/attendee';

	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import InvalidCross from './InvalidCross.svelte';
	import { Readable, writable } from 'svelte/store';
	const dispatch = createEventDispatcher();

	export let attendee: Readable<Attendee>;

	// Live updating checklist for attendee
	let checkedIn = false;
	let checkList = {};
	$: {
		checkList = {
			'Booking Found': $attendee.booking_id,
			'COVID Pass Verfied': false
		};
		// jankly adding in `Not` if not checked in
		checkedIn = $attendee.checked_in_at !== null;
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
	}


	// Detail level manager
	let detailLevel = writable(0);
	let elementWidth = 0;
	let detailLevelManager: NodeJS.Timer;
	onMount(()=>{
		detailLevelManager = setInterval(()=>{
			console.log(elementWidth)
			detailLevel.set(Math.floor(elementWidth / 250))
		}, 250);
	});
	onDestroy(()=> {
		if(detailLevelManager){
			clearInterval(detailLevelManager);
		}
	});

</script>

<div class="details-container" bind:clientWidth={elementWidth}>
	<div class="detail-column">
		<h2 class="attendee-name">
			{$attendee.first_name}
			{$attendee.last_name}
		</h2>
		<div class="attendee-org">
			{$attendee.organisation || ''}
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
		{#if $attendee.requirements}
			{$attendee.requirements}
		{:else}
			<span class="detail-missing">No Requirements Found</span>
		{/if}
		<h3 class="detail-group-header">Attendee Details</h3>
		{#if $attendee.email_address}
			<div class="detail-key-value">
				<span class="detail-key">Email</span>
				<span class="detail-value">{$attendee.email_address}</span>
			</div>
		{/if}
		{#if $attendee.contact_phone}
			<div class="detail-key-value">
				<span class="detail-key">Phone</span>
				<span class="detail-value">{$attendee.contact_phone}</span>
			</div>
		{/if}
		{#if $attendee.ticket_type_name}
			<div class="detail-key-value">
				<span class="detail-key">Ticket Type</span>
				<span class="detail-value">{$attendee.ticket_type_name}</span>
			</div>
		{/if}
	</div>
	{/if}
	{#if $detailLevel > 2}
		<div class="detail-column">
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
		</div>
	{/if}
</div>
<div class="action-container">
	{#if checkedIn}
		<Button on:click={removeLatestCheckIn} color="warning">Remove Check In</Button>
	{:else}
		<Button on:click={checkIn}>Check In</Button>
	{/if}
	<Button on:click={moreDetails} color="secondary">More Details</Button>
</div>

<style lang="scss">
	.details-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: stretch;
		margin-bottom: 1rem;
		box-sizing: border-box;
		list-style: none;
		flex-shrink: 0;

		.detail-column {
			position: relative;
			padding: 0 1rem;
			flex: 1 1 auto;
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
				padding: 1em;
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
			& + .detail-column {
				border-left: solid 1px black;
			}
		}
	}

	.action-container {
		position: absolute;
		bottom: 0;
	}
</style>
