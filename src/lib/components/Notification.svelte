<script lang="ts">
	import type { NotificationInstance } from '@svelte-put/noti';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	// optional, injected automatically by @svelte-put/noti
	export let notification: NotificationInstance;

	export let content: string | undefined = undefined;

	const { progress } = notification;

	const dispatch = createEventDispatcher<{ resolve: string }>();
	const dismiss = () => dispatch('resolve', 'popped from within component');

	export let closeable: boolean = false;

	import type { Errors } from "$lib/errors";

	export let errors: Errors = {}

	const errorCount = Object.keys(errors).length

	function formatError(name: string, messages: string[]): string {
		return `${ name[0].toUpperCase() }${ name.slice(1) } ${ messages.join(', ') }`
	}
</script>

<div
	class="alert"
	in:fly|global={{ duration: 200, y: -20 }}
	on:mouseenter={ progress.pause }
	on:mouseleave={ progress.resume }
>
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
		<p>{ content }</p>
	{/if}
	{#if closeable}
		<button on:click={dismiss} class="alert-close">×</button>
	{/if}
	{#if notification.timeout}
		<div
			class="progress absolute inset-x-0 bottom-0 h-0.5 bg-orange-600 origin-left"
			class:paused={$progress.state === 'paused'}
			style={`--progress-duration: ${notification.timeout}ms;`}
		/>
	{/if}
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.alert {
		border-radius: 10px;
		background: #FD9E10;
		padding: .375rem .75rem;
		color: #FFF;
		text-align: center;
		font-weight: 700;
		line-height: 1.5625;
		position: relative;

		@apply
			shadow-lg
			pointer-events-auto
			flex items-start md:items-center justify-center gap-4
			max-w-3xl
			overflow-x-hidden;

		&-close {
			margin: -.375rem -.75rem -.375rem -.5rem;
			padding: .375rem 0.75rem .375rem .5rem;

			&:hover {
				background: darken(#FD9E10, 10%);
			}
		}
	}

	.progress {
		animation: progress var(--progress-duration) linear;
	}

	.progress.paused {
		animation-play-state: paused;
	}

	@keyframes progress {
		from {
			transform: scaleX(0);
		}

		to {
			transform: scaleX(1);
		}
	}
</style>
