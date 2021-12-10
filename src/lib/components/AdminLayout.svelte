<script lang="ts">
	import Card from './Card.svelte';
	import logo from '$lib/assets/logo/wordmark-white.svg';
	export let cardOptionsLeft = {};
	export let cardOptionsRightTop = {};
	export let cardOptionsRightBottom = {};
</script>

<div class="brand">
	<img src={logo} alt="Lil Regie logo" />
</div>
<div class="panel-container">
	<div class="left-bar">
		<Card expand={true} {...cardOptionsLeft}>
			<slot name="left-bar" />
			<slot name="left-bar-footer" slot="footer" />
		</Card>
	</div>
	<div class="right-bar">
		<slot name="right-bar">
			<div class="info-panel">
				<Card expand={true}>
					<slot name="info-panel" />
				</Card>
			</div>
			<div class="list-panel">
				<Card expand={true}>
					<slot name="list-panel" />
				</Card>
			</div>
		</slot>
	</div>
</div>

<style lang="scss">
	$item-spacing: 2rem;

	.brand {
		position: fixed;
		top: calc($item-spacing / 2);
		right: calc($item-spacing / 2);
		img {
			height: $item-spacing;
			width: auto;
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
		width: 100vw;
		height: 100vh;
		row-gap: $item-spacing;
		column-gap: $item-spacing;

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
		}
		.list-panel {
			flex: 1;
			max-height: 50vh;
			overflow: auto;
		}
	}
</style>
