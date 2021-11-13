<script lang="ts">
	import { goto } from '$app/navigation';
	import { chosenEventID, allEvents, chosenEvent } from '$lib/store';
	import { eventNameFromReference } from '$lib/utill';
	import { onMount } from 'svelte';
	import Select from 'svelte-select';
	import { get } from 'svelte/store';

	let eventsDropdownList = [];
	let eventsDropdownChosen = null;

	allEvents.subscribe((events) => {
		eventsDropdownList = events.map((event) => {
			return { value: event.id, label: eventNameFromReference(event.reference) };
		});
	});

	onMount(() => {
		if (get(chosenEvent) !== null) {
			eventsDropdownChosen = {
				value: get(chosenEventID),
				label: eventNameFromReference(get(chosenEvent).reference)
			};
		}
	});

	function choseProject() {
		console.log(eventsDropdownChosen);
		chosenEventID.set(eventsDropdownChosen.value);
		goto('/admin/dashboard');
	}
</script>

<div class="container">
	<h1>Lorem ipsum dolor.</h1>
	<div>
		<Select items={eventsDropdownList} bind:value={eventsDropdownChosen} />
		<button
			class="lr-button large"
			type="submit"
			on:click={choseProject}
			disabled={typeof eventsDropdownChosen === 'undefined' || eventsDropdownChosen === null}
		>
			Chose Project
		</button>
	</div>
</div>

<style lang="scss">
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
		form {
			select {
				display: block;
			}
		}
	}
</style>
