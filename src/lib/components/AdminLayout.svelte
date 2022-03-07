<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export const load = async ({ url }) => ({ props: { url } });
</script>

<script lang="ts">
	import Card from './Card.svelte';
	import logo from '../assets/logo/wordmark-white.svg';

	import { checkedInCount, eventAttendees, chosenEvent, chosenEventID } from '$lib/store';

	import { fade, fly } from 'svelte/transition';
	import { basePath } from '$lib/consts';

	interface CardOptions {
		margin?: boolean;
		scroll?: boolean;
		shadow?: false | 'small' | 'medium' | 'large';
		highlighted?: boolean;
	}

	interface Cards {
		left: false | CardOptions;
		rightTop: false | CardOptions;
		rightBottom: false | CardOptions;
	}

	export let cards: Cards = {
		left: {},
		rightTop: {},
		rightBottom: {}
	};

	// Transition between pages
	export let url = "";
	const pageTransitionDuration = 250;
</script>

<div class="brand">
	<a href={`${basePath}/${$chosenEventID}`}>
		<img src={logo} alt="Lil Regie logo" />
	</a>
</div>

{#key url}
	<div
		class="transition-wrapper"
		in:fly={{ x: -5, duration: pageTransitionDuration, delay: 1.1*pageTransitionDuration }}
		out:fade={{duration: pageTransitionDuration }}
	>
		<div class="stats-container">
			{#if $eventAttendees !== null}
				<div class="stat">
					<span class="stat-value">{$checkedInCount}</span>
					<span class="stat-label">Checked In</span>
				</div>

				{#if $chosenEvent?.ticket_limit}
					<div class="stat">
						<span class="stat-value">{$chosenEvent?.ticket_limit - $checkedInCount || '??'}</span>
						<span class="stat-label">Available Tickets</span>
					</div>
				{/if}

				<div class="stat">
					<span class="stat-value">{$eventAttendees?.length || '??'}</span>
					<span class="stat-label">Registrations</span>
				</div>
			{/if}
		</div>
		<div class="panel-container">
			<div class="left-bar" class:highlighted={cards.left && cards.left.highlighted}>
				<slot name="left-bar-header" />
				{#if cards.left}
					<Card expand={true} {...cards.left}>
						<slot name="left-bar" />
						<slot name="left-bar-footer" slot="footer" />
					</Card>
				{:else}
					<slot name="left-bar" />
				{/if}
			</div>
			<div class="right-bar">
				<slot name="right-bar">
					<div class="info-panel" class:highlighted={cards.rightTop && cards.rightTop.highlighted}>
						<div class="info-panel-header">
							<slot name="info-panel-header" />
						</div>
						{#if cards.rightTop}
							<Card expand={true} {...cards.rightTop}>
								<slot name="info-panel" />
							</Card>
						{:else}
							<div class="info-panel-content">
								<slot name="info-panel" />
							</div>
						{/if}
					</div>
					<div
						class="list-panel"
						class:highlighted={cards.rightBottom && cards.rightBottom.highlighted}
					>
						<div class="list-panel-header">
							<slot name="list-panel-header" />
						</div>
						{#if cards.rightBottom}
							<Card expand={true} {...cards.rightBottom}>
								<slot name="list-panel" />
							</Card>
						{:else}
							<div class="list-panel-content">
								<slot name="list-panel" />
							</div>
						{/if}
					</div>
				</slot>
			</div>
		</div>
	</div>
{/key}

<style lang="scss">
	@use '../styles/vars.scss' as *;

	$item-spacing: 2rem;

	.brand {
		position: fixed;
		top: calc($item-spacing / 2);
		left: calc($item-spacing / 2);
		img {
			height: $item-spacing;
			width: auto;
			cursor: pointer;
			transition: filter 150ms ease-in-out;
		}
		&:hover {
			img {
				filter: brightness(0.8);
			}
		}
	}

	.stats-container {
		position: fixed;
		top: calc($item-spacing / 2);
		right: calc($item-spacing / 2);
		display: flex;
		flex-direction: row;
		color: $text-dark;
		.stat {
			margin: 0 1em;
			.stat-value {
				font-weight: bold;
			}
		}
	}

	.panel-container {
		padding: $item-spacing * 2;
		@media screen and (max-width: 650px) {
			padding: 1rem;
			.left-bar,
			.right-bar {
				min-width: 100% !important;
			}
		}
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		flex-grow: 1;
		flex-wrap: wrap;
		height: 100vh;
		row-gap: $item-spacing;
		column-gap: $item-spacing;

		.left-bar,
		.right-bar {
			max-height: 100%;
		}

		.left-bar {
			flex: 1;
			min-width: 400px;
			overflow: auto;
		}
		.right-bar {
			min-width: 400px;
			flex: 3;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			row-gap: $item-spacing;
			column-gap: $item-spacing;
			overflow: auto;
		}
		.info-panel {
			flex: 1;
			max-height: 50%;
			display: flex;
			flex-flow: column;
			overflow: none;
			.info-panel-header {
				flex: 0 1 auto;
			}
			.info-panel-content {
				flex: 1 1 auto;
				overflow: auto;
			}
		}
		.list-panel {
			flex: 1;
			max-height: 50vh;
			overflow: auto;
			display: flex;
			flex-flow: column;
			.list-panel-header {
				flex: 0 1 auto;
			}
			.list-panel-content {
				flex: 1 1 auto;
				overflow: auto;
			}
		}
	}
	.list-panel,
	.info-panel,
	.left-bar {
		transition: box-shadow 500ms ease;
		&.highlighted {
			box-shadow: map-get($shadows, "highlight" );
			overflow: visible;
		}
	}
</style>
