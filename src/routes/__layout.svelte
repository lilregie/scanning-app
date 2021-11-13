<script lang="ts">
	import '../global.scss';
</script>

<slot />

<style lang="scss">
	:global(body) {
		background-color: $background-backdrop;
	}
</style>
