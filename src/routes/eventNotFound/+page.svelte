<script lang="ts">
	import type { PageData } from './$types';

	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
	import { basePath } from '$lib/consts';

	export let data: PageData;

	let eventID: string;
	$: eventID = data.eventID;
</script>

<div class="container">
	<h1>Couldn't find the event!</h1>
	{#if eventID}
		<p>We couldn't find event <b>#{eventID}</b> in your account!</p>
	{:else}
		<p>We couldn't find the event you are looking for in your account!</p>
	{/if}
	<Button
		size="large"
		on:click={() => {
			goto(`${basePath}/`);
		}}>Select Another Event</Button
	>
</div>

<style lang="scss">
	@use '../../lib/styles/vars.scss' as *;

	.container {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;

		h1 {
			margin: 0;
			margin-top: 4em;
			font-size: 4rem;
			color: $text-dark;
		}

		p {
			font-size: 1.5rem;
			color: $text-dark;
		}
	}
</style>
