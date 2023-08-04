<script lang="ts">
	import type { Eventlet, EventletSingle } from '$lib/event';

	import {
		currentEvent,
		selectedEventletIDs as globalSelectedEventletIDs
	} from '$lib/store';
	import dayjs from 'dayjs';
	import isBetween from 'dayjs/plugin/isBetween';
	dayjs.extend(isBetween);

	import { get, writable } from 'svelte/store';
	import EventletSelector from './EventletSelector.svelte';

	$: startingEventlets = $globalSelectedEventletIDs.map((id: number) => {
		return get(currentEvent).eventlets.find((eventlet: Eventlet) => {
			return eventlet.id === id;
		});
	});

	function updateGlobalEventlets(detail: { detail: EventletSingle[] }) {
		console.log('Updated eventlets: ', detail);
		globalSelectedEventletIDs.set(
			detail.detail.map((eventlet: EventletSingle) => {
				return eventlet.id;
			})
		);
	}
</script>

<div class="container">
	<div class="header">Choose your eventlets</div>
	<EventletSelector multiSelect={true} on:select={updateGlobalEventlets} {startingEventlets} />
</div>

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		height: 100%;
		width: 100%;

		.header {
			font-size: 2rem;
			margin: 1rem;
			text-align: center;
		}
	}

	@media screen and (max-width: $breakpoint-mobile) {
		.header {
			font-size: 1.25rem;
		}
	}
</style>
