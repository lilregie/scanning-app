<script lang="ts">
	export let eventlet: { id: number | string, name: string, value?: string }
	export let group: any = undefined
	export let disabled: boolean = false
	export let showByline: boolean = true
</script>

<label class="card isLabel">
	<input
		type="radio"
		name="scan-action"
		id={ typeof eventlet.id == 'number' ? `check-in-eventlet-${ eventlet.id }` : eventlet.id }
		class="appearance-none h-6 w-6 rounded-full control flex-shrink-0"
		value={ eventlet.value ?? eventlet.id.toString() }
		bind:group={ group }
		{ disabled }
	>
	<div class="content">
		{#if typeof eventlet.id == 'number' && showByline}
			<small class="block">Check attendee in to:</small>
		{/if}
		<div class="font-bold">{ eventlet.name }</div>
	</div>
</label>

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	$primaryColor: map-get($map: $theme-colors, $key: "primary");

	.isLabel {
		color: $primaryColor;
		cursor: pointer;
		justify-content: flex-start;

		@apply gap-4;
	}

	.control {
		border: 1px solid $primaryColor;

		&:checked {
			background: $primaryColor;
		}

		&:checked:after {
			color: #FFFFFF;
			border: 3px solid transparent;
			border-right-color: currentColor;
			border-bottom-color: currentColor;

			content: "";
			display: block;
			height: 75%;
			width: 40%;
			rotate: 45deg;
			translate: 75%;
		}
	}

	.content {
		color: $text-light;
	}
</style>
