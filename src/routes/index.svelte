<script lang="ts">
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { chosenProject } from '$lib/store';

	function fakeChoseProject() {
		chosenProject.set("testing")
		goto('/admin/dashboard');
	}
</script>

<div class="container">
	<h1>Lorem ipsum dolor.</h1>
	<div>
		<button class="lr-button large" on:click={fakeChoseProject}>Chose Project 'testing'</button>
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
	}
</style>
