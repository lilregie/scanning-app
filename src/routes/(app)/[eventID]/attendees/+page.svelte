<script lang="ts">
	import type { PageData } from './$types.js';
	import { page } from '$app/stores';

	export let data: PageData;
	let selectedEventletId: string;
	selectedEventletId = $page.url.searchParams.get('eventlet') ?? '';

	let selectedCheckinStatus: string;
	selectedCheckinStatus = $page.url.searchParams.get('filter') ?? '';
</script>
{#await data.event}
	Loading…
{:then event}
	<form action="" class="space-y-4">
		{#if !event.standalone}
			<div>
				<label for="eventlet">
					Show attendees for
				</label>
				<select id="eventlet" name="eventlet" class="eventlet-select" bind:value={selectedEventletId}>
					<option value="">All Eventlets</option>
					{#each event.eventlets as eventlet}
						<option value={ eventlet.id }>{ eventlet.name }</option>
					{/each}
				</select>
			</div>
		{/if}
		<div class="flex items-center">
			<label for="q" hidden>Name or booking number</label>
			<input
				type="text"
				id="q"
				name="q"
				class="lookup flex-grow"
				placeholder="Name or booking #"
				value={ $page.url.searchParams.get('q') ?? '' }
			>
			<button type="submit" class="btn-filter flex-shrink-0 p-3">
				<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M23.0367 22.0332L17.0171 16.0137C18.3199 14.4414 19.0386 12.4199 19.0386 10.2188C19.0386 5.09766 14.8159 0.875 9.69485 0.875C4.52884 0.875 0.396027 5.09766 0.396027 10.2188C0.396027 15.3848 4.57376 19.5625 9.69485 19.5625C11.8511 19.5625 13.8726 18.8438 15.4898 17.541L21.5093 23.5605C21.7339 23.7852 22.0034 23.875 22.3179 23.875C22.5874 23.875 22.857 23.7852 23.0367 23.5605C23.4859 23.1562 23.4859 22.4824 23.0367 22.0332ZM2.55228 10.2188C2.55228 6.26562 5.74173 3.03125 9.73978 3.03125C13.6929 3.03125 16.9273 6.26562 16.9273 10.2188C16.9273 14.2168 13.6929 17.4062 9.73978 17.4062C5.74173 17.4062 2.55228 14.2168 2.55228 10.2188Z" />
				</svg>
			</button>
		</div>
		<div class="text-center space-x-2">
			<input type="radio" name="filter" id="checked_in_all" value="" hidden bind:group={selectedCheckinStatus}>
			<label for="checked_in_all" class="badge">
				All
			</label>
			<input type="radio" name="filter" id="not_checked_in" value="false" hidden bind:group={selectedCheckinStatus}>
			<label for="not_checked_in" class="badge">
				Not checked in
			</label>
			<input type="radio" name="filter" id="checked_in" value="true" hidden bind:group={selectedCheckinStatus}>
			<label for="checked_in" class="badge">
				Checked in
			</label>
		</div>
	</form>
{/await}
{#await data.attendees}
	Loading attendee data
{:then attendees}
	<ol class="mt-4 space-y-3">
		{#each attendees as attendee}
			{#each attendee.attendances as attendance}
				<li class="card">
					<div>
						<div class="text-bold">{ attendee.first_name } { attendee.last_name }</div>
						<div class="text-black">{ attendance.eventlet_name }</div>
						<div class="text-black">Booking #{ attendee.booking_id }</div>
					</div>
					{#if !!attendance.checked_in_at}
						<button class="btn-check-in isDone flex-shrink-0">Checked-in</button>
					{:else}
						<button class="btn-check-in flex-shrink-0">Check-in</button>
					{/if}
				</li>
			{/each}
		{/each}
	</ol>
{/await}

<style lang="scss">
	@use '../../../../lib/styles/vars.scss' as *;

	.eventlet-select {
		border-radius: 5px;
		border: 1px solid #DFDFDF;
		background: #FFFFFF;
		padding: 1em;
		max-width: 100%;
		inset: none;
	}

	.lookup {
		border-radius: 5px 0px 0px 5px;
		border: 1px solid #DFDFDF;
		background: #FFF;
		padding: 0.75em;
	}

	.badge {
		border-radius: 9999px;
		background: #DADADA;
		color: map-get($theme-colors, 'primary');
		display: inline-block;
		padding: 0.5em 1em;
	}

	input:checked + .badge {
		background: #FFFFFF;
		color: #000000;
	}

	label[for] {
		cursor: pointer;
	}

	.btn-filter {
		border-radius: 5px 0px 0px 5px;
		border: 1px solid #DFDFDF;
		fill: #FFFFFF;
		background: map-get($theme-colors, 'primary');
	}

	.btn-check-in {
		border-radius: 10px;
		border: 1px solid currentColor;
		color: map-get($theme-colors, 'primary');
		font: {
			weight: 700;
		}
		padding: 10px;

		&.isDone {
			border-color: #3DC393;
			background: #3DC393;
			color: #FFFFFF;
		}
	}
</style>
