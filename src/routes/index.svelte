<script lang="ts">
	import { chosenEventID, allEvents, chosenEvent } from '$lib/store';
	import { onMount } from 'svelte';
	import Select from 'svelte-select';
	import { get } from 'svelte/store';
	import Button from '$lib/components/Button.svelte';
	import { basePath } from '$lib/consts';
	import { goto } from '$app/navigation';

	let eventsDropdownList = [];
	let eventsDropdownChosen: {value: string,label: string} = null;


	allEvents.subscribe((events) => {
		eventsDropdownList = events.map((event) => {
			return { value: event.id, label: event.name };
		});
	});

	onMount(() => {
		if (get(chosenEvent) !== null) {
			eventsDropdownChosen = {
				value: get(chosenEventID).toString(),
				label: get(chosenEvent).name
			};
		}
	});

	function choseProject() {
		chosenEventID.set(parseInt(eventsDropdownChosen.value));
		goto(`${basePath}/${eventsDropdownChosen.value}`);
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
			>Choose Event</Button
		>
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
