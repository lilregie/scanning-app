<div class="missmatch-warning">
    <div class="message">
        <h3 class="title"><slot name="title"></slot></h3>
        <slot name="message"></slot>
    </div>
    <div class="table">
        <slot name="table"></slot>
    </div>
    <div class="actions">
        <slot name="actions" class="actions-wrapper"></slot>
    </div>
</div>

<style lang="scss">
    @use '../../styles/vars.scss' as *;
	@use 'sass:map';
    .missmatch-warning {
		box-sizing: border-box;

		padding: 1em;
		font-size: 1.1rem;

		background-color: $background-foreground;


		display: grid;
		grid-template:
			'message table' auto
			'message action' auto;

		border: 2px solid map-get($theme-colors, 'warning');
		border-radius: $radius-default;

		.title {
			margin: 0;
		}

		.actions {
			display: flex;
			justify-content: right;
			margin-top: 1em;
			grid-area: action;
			column-gap: 0.5em;
		}
		.message {
			grid-area: message;
		}
		.table {
			grid-area: table;
		}
	}
</style>