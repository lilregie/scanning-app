<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from 'svelte-simple-modal';

	import { initializeAPI } from '$lib/api/api';

	import '../global.scss';
	import { globalModalState } from '$lib/store';
	import ConnectionMaster from '$lib/components/connectionInfo/connectionMaster.svelte';

	onMount(initializeAPI);
</script>

<Modal styleWindow={{width: "80vw"}} bind:show={$globalModalState} on:closed={()=>globalModalState.set(null)}>
	<ConnectionMaster/>
	<slot />
</Modal>

<style lang="scss">
	@use '../lib/styles/vars.scss' as *;
	:global(body) {
		background-color: $background-backdrop;
	}
</style>
