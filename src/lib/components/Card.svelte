<script lang="ts">
	export let expand: boolean = false;
	export let shadow: false | 'small' | 'medium' | 'large' = 'medium';
</script>

<div class="card shadow-{shadow}" class:expand>
	<slot />
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;
	.card {
		background: $background-foreground;
		color: $text-light;
		border-radius: $radius-default;
		padding: 2rem;
		box-sizing: border-box;

		@each $size, $shadow in $shadows {
			&.shadow-#{$size} {
				box-shadow: $shadow;
			}
		}

		&.expand {
			flex: 1;
			height: 100%;
			overflow: auto;
		}
	}
</style>
