<script lang="ts">
	import { onMount } from 'svelte';

	import { initializeAPI } from '$lib/api';

	import '../global.scss';

	onMount(() => {
		initializeAPI();
	});
</script>

<slot />

<style lang="scss">
	:global(body) {
		background-color: $background-backdrop;
	}
</style>
