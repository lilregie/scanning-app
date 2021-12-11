<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from 'svelte-simple-modal';

	import { initializeAPI } from '$lib/api';

	import '../global.scss';

	onMount(() => {
		initializeAPI();
	});
</script>

<Modal>
	<slot />
</Modal>

<style lang="scss">
	@use '../lib/styles/vars.scss' as *;
	:global(body) {
		background-color: $background-backdrop;
	}
</style>
