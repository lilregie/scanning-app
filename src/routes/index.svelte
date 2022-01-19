<script lang="ts">
	import { chosenEventID, allEvents, chosenEvent } from '$lib/store';
	import { eventNameFromReference } from '$lib/utill';
	import { onMount } from 'svelte';
	import Select from 'svelte-select';
	import { get } from 'svelte/store';
	import Button from '$lib/components/Button.svelte';
	import { basePath } from '$lib/consts';
	import { goto } from '$app/navigation';

	let eventsDropdownList = [];
	let eventsDropdownChosen = null;

	console.log(import.meta.env.BASE_URL)

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
		chosenEventID.set(eventsDropdownChosen.value);
		goto(`${basePath}/admin/dashboard`);
	}
</script>

<div class="container">
	<h1>Lorem ipsum dolor.</h1>
	<div class="project-selection">
		<div>
			<Select items={eventsDropdownList} bind:value={eventsDropdownChosen} />
		</div>
		<div>
			<Button
				on:click={choseProject}
				disabled={typeof eventsDropdownChosen === 'undefined' || eventsDropdownChosen === null}
				>Choose Project</Button
			>
		</div>
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
		.project-selection{
			min-width: 15em;
			div {
				margin-bottom: 1em;
			}
		}
	}
</style>
