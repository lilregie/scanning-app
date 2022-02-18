<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ url }) {

		return {
			props: {
				eventID: parseInt(url.searchParams.get('eventID')) || null,
			}
		};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import Button from '$lib/components/Button.svelte';
	import { basePath } from '$lib/consts';

    export let eventID: string;
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
	@use '../lib/styles/vars.scss' as *;
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
