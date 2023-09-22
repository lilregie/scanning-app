<!-- Notification.svelte -->
<script lang="ts">
	import type { Errors } from "$lib/errors";

	export let errors: Errors = {}

	const errorCount = Object.keys(errors).length

	function formatError(name: string, messages: string[]): string {
		return `${ name[0].toUpperCase() }${ name.slice(1) } ${ messages.join(', ') }`
	}
</script>

<div class="alert">
	{#if errorCount === 1}
		{#each Object.entries(errors) as [name, messages]}
			<p>{ formatError(name, messages) }</p>
		{/each}
	{:else if errorCount > 1}
		<ul>
			{#each Object.entries(errors) as [name, messages]}
				<li>{ formatError(name, messages) }</li>
			{/each}
		</ul>
	{:else}
		<p><slot /></p>
	{/if}
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.alert {
		border-radius: 10px;
		background: #FD9E10;
		padding: 0.75rem;
		color: #FFF;
		text-align: center;
		font-weight: 700;
		line-height: 1.5625;
	}
</style>
