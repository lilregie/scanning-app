<script lang="ts">
	import Card from '$lib/components/Card.svelte';

	import OuterRingLayout from './OuterRingLayout.svelte';

	interface CardOptions {
		margin?: boolean;
		scroll?: boolean;
		shadow?: false | 'small' | 'medium' | 'large';
		highlighted?: boolean;
		hide?: boolean;
		background?: boolean | string;
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

	export let overflowType = {
		left: 'auto',
		rightTop: 'auto',
		rightBottom: 'auto'
	};

	export let backPath: string;
	export let url: string;
</script>

<OuterRingLayout {backPath} {url}>
	<div class="panel-container">
		<div
			class="left-bar"
			class:highlighted={cards.left && cards.left.highlighted}
			style={`--overflow-type: ${overflowType.left}`}
		>
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
				{#if cards.rightTop ? !cards.rightTop.hide : true}
					<div
						class="info-panel"
						class:highlighted={cards.rightTop && cards.rightTop.highlighted}
						style={`--overflow-type: ${overflowType.rightTop}`}
					>
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
				{/if}
				{#if $$slots['list-panel']}
					<div
						class="list-panel"
						class:highlighted={cards.rightBottom && cards.rightBottom.highlighted}
						style={`--overflow-type: ${overflowType.rightBottom}`}
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
				{/if}
			</slot>
		</div>
	</div>
</OuterRingLayout>

<style lang="scss">
	@use '../../styles/vars.scss' as *;
	@use './vars.scss' as *;

	.panel-container {
		height: 100%;

		@media screen and (max-width: $breakpoint-mobile) {
			.left-bar,
			.right-bar {
				min-width: 100% !important;
			}
			.right-bar > div {
				min-height: 50vh;
			}
		}

		display: flex;
		flex-direction: row;
		align-items: stretch;
		flex-grow: 1;
		flex-wrap: wrap;
		row-gap: $item-spacing;
		column-gap: $item-spacing;

		.left-bar,
		.right-bar {
			max-height: 100%;
		}

		.left-bar {
			flex: 1;
			min-width: 400px;
			overflow: var(--overflow-type);
		}
		.right-bar {
			min-width: 400px;
			flex: 3;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			justify-content: center;
			row-gap: $item-spacing;
			column-gap: $item-spacing;
		}
		.info-panel {
			flex: 1;
			max-height: 50%;
			display: flex;
			flex-flow: column;
			.info-panel-header {
				flex: 0 1 auto;
			}
			.info-panel-content {
				flex: 1 1 auto;
				overflow: var(--overflow-type);
			}
		}
		.list-panel {
			flex: 1;
			max-height: 50vh;
			overflow: var(--overflow-type);
			display: flex;
			flex-flow: column;
			.list-panel-header {
				flex: 0 1 auto;
			}
			.list-panel-content {
				flex: 1 1 auto;
				overflow: var(--overflow-type);
			}
		}
	}
	.list-panel,
	.info-panel,
	.left-bar {
		transition: box-shadow 500ms ease;
		&.highlighted {
			box-shadow: map-get($shadows, 'highlight');
			overflow: visible;
		}
	}
</style>
