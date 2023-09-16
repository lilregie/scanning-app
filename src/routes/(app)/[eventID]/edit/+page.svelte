<script lang="ts">
	import type { PageData } from './$types';

	import Scanner from '$lib/components/scanner/ScannerWrapper.svelte';

	import type { ScanSuccess } from '$lib/components/scanner/validateScan';
	import { byNameRank } from '$lib/utill';
	import MetaTitle from '$lib/components/MetaTitle.svelte';
	import EventletRadio from '$lib/components/eventlet/EventletRadio.svelte';
	import { page } from '$app/stores';
	import { applyAction } from '$app/forms';
	import { csrfAPIState } from '$lib/api/statusStores';
	import { globalModalState } from '$lib/store';
	import FullAttendeeDetails from '$lib/components/modal/FullAttendeeDetails.svelte';
	import { bind } from 'svelte-simple-modal';
	import { readable } from 'svelte/store';

	export let data: PageData;

	async function fetchAttendeeDetails(ticket_uuid: string) {
		return await fetch(`/checkin/events/${$page.params.eventID}/tickets/${ticket_uuid}`, {
			headers: {
				"Accept": "application/json"
			}
		})
	}

	async function checkin(ticket_uuid: string) {
		const data = { eventlet_id: eventletParam, authenticity_token: $csrfAPIState }
		return await fetch(`/checkin/events/${$page.params.eventID}/tickets/${ticket_uuid}/checkin`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		})
	}

	async function checkinScan(event: CustomEvent<ScanSuccess>) {
		disabled = true
		const ticket_uuid = event.detail.data.key;

		try {
			let response

			if (eventletParam === '' || eventletParam === null) {
				response = await fetchAttendeeDetails(ticket_uuid)
			} else {
				response = await checkin(ticket_uuid)
			}

			if (response.status === 200) {
				const result = await response.json()
				const attendee = result["attendee"] ?? result

				$globalModalState = bind(
					FullAttendeeDetails,
					{
						attendee: readable(attendee),
						event: data.event
					}
				)
				applyAction({ status: response.status, type: "success", data: result })
			} else if (response.type === "error" || response.status >= 500) {
				applyAction({ status: response.status, type: "error", error: response.statusText });
			} else if (response.status >= 400) {
				applyAction({ status: response.status, type: "failure", data: (await response.json()) })
			}
		} catch (error) {
			console.error(error)
		}

		disabled = false
	}

	let eventletParam: string = $page.url.searchParams.get('eventlet') ?? '';
	let disabled = false
</script>

{#await data.event then event}
	<MetaTitle parts={ [event.name, "Scan"] } />

	<div class="scanner-container">
		<Scanner on:scan-complete={checkinScan} />
	</div>
	<div>
		<h1>Scan ticket and…</h1>
		<form class="flex flex-col gap-2">
			<EventletRadio
				eventlet={{
					id: 'show-attendee-details',
					name: 'Show attendee details',
					value: ''
				}}
				bind:group={ eventletParam }
				{ disabled }
			/>
			{#each event.eventlets.sort(byNameRank) as eventlet (eventlet.id)}
				{#if event.standalone}
					<EventletRadio bind:group={ eventletParam } { disabled }>
						<div slot="content">Check attendee in</div>
					</EventletRadio>
				{:else}
					<EventletRadio {eventlet} bind:group={ eventletParam } { disabled } />
				{/if}
			{/each}
		</form>
	</div>
{/await}

<style lang="scss">
	@use '../../../../lib/styles/vars.scss' as *;
</style>
