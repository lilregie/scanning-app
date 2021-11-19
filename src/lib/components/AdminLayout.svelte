<script lang="ts">
	import Card from './Card.svelte';
	import logo from '../../../static/logo/wordmark-white.svg';
</script>

<div class="brand">
	<img src={logo} alt="Lil Regie logo" />
</div>
<div class="panel-container">
	<div class="left-bar">
		<Card expand={true}>
			<slot name="left-bar" />
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
	$item-border-radius: 1rem;

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
		width: 100vw;
		min-height: 100vh;
		row-gap: $item-spacing;
		column-gap: $item-spacing;

		.left-bar {
			flex: 1;
		}
		.right-bar {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			row-gap: $item-spacing;
			column-gap: $item-spacing;
			border-radius: $item-border-radius;
		}
		.info-panel {
			flex: 1;
		}
		.list-panel {
			flex: 1;
		}
	}
</style>
