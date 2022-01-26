<script lang="ts">
	import Card from './Card.svelte';
	import logo from '../assets/logo/wordmark-white.svg';

	import { checkedInCount, eventAttendees, chosenEvent } from '$lib/store';

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
</script>

<div class="brand">
	<img src={logo} alt="Lil Regie logo" />
</div>
<div class="stats-container">
	<div class="stat">
		<span class="stat-value">{$checkedInCount}</span>
		<span class="stat-label">Checked In</span>
	</div>

	<div class="stat">
		<span class="stat-value">{$chosenEvent?.total_tickets - $checkedInCount}</span>
		<span class="stat-label">Available Tickets</span>
	</div>

	<div class="stat">
		<span class="stat-value">{$eventAttendees.length}</span>
		<span class="stat-label">Registered</span>
	</div>
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
			overflow: auto;
			display: flex;
			flex-flow: column;
			.info-panel-header {
				flex: 0 1 auto;
			}
			.info-panel-content {
				flex: 1 1 auto;
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
		transition: all 200ms ease;
		&.highlighted {
			box-shadow: 0px 0px 8px 4px rgba(207, 34, 101, 0.56);
			overflow: visible;
		}
	}
</style>
