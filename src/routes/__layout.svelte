<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from 'svelte-simple-modal';

	import { initializeAPI } from '$lib/api';

	import '../global.scss';
	import { globalModalState } from '$lib/store';

	onMount(() => {
		initializeAPI();
	});
</script>

<Modal styleWindow={{width: "80vw"}} bind:show={$globalModalState} on:closed={()=>globalModalState.set(null)}>
	<slot />
</Modal>

<style lang="scss">
	@use '../lib/styles/vars.scss' as *;
	:global(body) {
		background-color: $background-backdrop;
	}
</style>
