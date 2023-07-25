<script lang="ts">
	import { currentEventID, allEvents, currentEvent } from '$lib/store';
	import { onMount } from 'svelte';
	import Select from 'svelte-select';
	import { get } from 'svelte/store';
	import Button from '$lib/components/Button.svelte';
	import { basePath } from '$lib/consts';
	import { goto } from '$app/navigation';

	let eventsDropdownList: { value: string; label: string }[] = [];
	let eventsDropdownChosen: { value: string; label: string } | null = null;


	allEvents.subscribe((events) => {
		eventsDropdownList = events.map((event) => {
			return { value: event.id.toString(), label: event.name };
		});
	});

	onMount(() => {
		let event = get(currentEvent);
		if (event !== null) {
			eventsDropdownChosen = {
				value: event.id.toString(),
				label: event.name
			};
		}
	});

	function choseProject() {
		if (eventsDropdownChosen !== null) {
			currentEventID.set(parseInt(eventsDropdownChosen.value));
			console.log(basePath, eventsDropdownChosen, `${basePath}/${eventsDropdownChosen.value}`)
			goto(`${basePath}/${eventsDropdownChosen.value}`);
		} else {
			console.warn('Tried to select event but no event was chosen?');
		}
	}
</script>

<div class="container">
	<h1>Choose your event</h1>
	<div class="event-selector">
		<Select items={eventsDropdownList} bind:value={eventsDropdownChosen} />
		<Button
			expanded
			on:click={choseProject}
			disabled={typeof eventsDropdownChosen === 'undefined' || eventsDropdownChosen === null}
		>
			Choose Event
		</Button>
	</div>
</div>

<style lang="scss">
	@use '../lib/styles/vars.scss' as *;
	.container {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		h1 {
			margin-top: 4em;
			font-size: 4rem;
			color: $text-dark;
		}
		.event-selector {
			width: 600px;
			max-width: calc(100% - 2rem);
		}
	}
</style>
