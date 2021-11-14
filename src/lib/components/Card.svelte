<script lang="ts">
	export let expand: boolean = false;
</script>

<div class="card" class:expand>
	<slot />
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;
	.card {
		background: $background-foreground;
		color: $text-light;
		border-radius: $radius-default;
		padding: 2rem;
		box-shadow: $shadow-md;
		box-sizing: border-box;

		&.expand {
			flex: 1;
			height: 100%;
		}
	}
</style>
