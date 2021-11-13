<div class="panel-container">
	<div class="left-bar">
		<slot name="left-bar" />
	</div>
	<div class="right-bar">
		<slot name="right-bar">
			<div class="info-panel">
				<slot name="info-panel" />
			</div>
			<div class="list-panel">
				<slot name="list-panel" />
			</div>
		</slot>
	</div>
</div>

<style lang="scss">
	$item-spacing: 1em;
	$item-border-radius: 1rem;
	$item-padding: 1em;

	.panel-container {
		padding: $item-spacing * 4;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		flex-grow: 1;
		width: 100vw;
		min-height: 100vh;

		.left-bar {
			flex: 1;
			margin-right: $item-spacing;
			border-radius: $item-border-radius;
			padding: $item-padding;
			background-color: $background-foreground;
		}
		.right-bar {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: stretch;
			margin-left: $item-spacing;
			border-radius: $item-border-radius;
		}
		.info-panel {
			flex: 1;
			margin-bottom: $item-spacing;
			border-radius: $item-border-radius;
			padding: $item-padding;
			background-color: $background-foreground;
		}
		.list-panel {
			flex: 1;
			margin-top: $item-spacing;
			border-radius: $item-border-radius;
			padding: $item-padding;
			background-color: $background-foreground;
		}
	}
</style>
