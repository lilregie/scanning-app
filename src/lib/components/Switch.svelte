<script lang="ts">
	export let checked = false;
	export let size: 'tiny' | 'small' | 'medium' | 'large' = 'medium';
	export let onColour: 'primary' | 'secondary' | 'success' | 'warning' = 'primary';

	// Heavily modified version of https://svelte.dev/repl/35d77f2ab11e4197a19ffd8e7c4ac74e?version=3.9.1

	const scaleMap = {
		tiny: 0.5,
		small: 0.8,
		medium: 1,
		large: 1.5
	};

	$: scale = scaleMap[size];
</script>

<label class="switch" style="--switch-scale: {scale};">
	<input type="checkbox" bind:checked class="{onColour}" />
	<span class="slider" />
</label>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.switch {
		position: relative;
		display: inline-block;
		width: calc(2.5rem * var(--switch-scale));
		height: calc(1.5rem * var(--switch-scale));

		input {
			opacity: 0;
			width: 0;
			height: 0;
			@each $name, $color in $theme-colors {
				&.#{$name} {
                    &:checked + .slider {
                        background-color: $color;
                        box-shadow: 0 0 1px $color;
                    }
				}
			}


			&:checked + .slider:before {
				transform: translateX(calc(1rem * var(--switch-scale)));
			}
		}
		.slider {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #ccc;
			transition: 200ms;
			border-radius: calc(1.5rem * var(--switch-scale));
			&:before {
				position: absolute;
				content: '';
				height: calc(1.2rem * var(--switch-scale));
				width: calc(1.2rem * var(--switch-scale));
				left: calc(0.15rem * var(--switch-scale));
				bottom: calc(0.15rem * var(--switch-scale));
				background-color: white;
				transition: 200ms;
				border-radius: 50%;
			}
		}
	}
</style>
