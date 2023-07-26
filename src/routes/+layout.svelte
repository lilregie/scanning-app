<script lang="ts">
	import { onMount } from 'svelte';
	import Modal from 'svelte-simple-modal';

	import '../global.scss';
	import { globalModalState } from '$lib/store';
	import ConnectionMaster from '$lib/components/connectionInfo/connectionMaster.svelte';
	import LayoutHeader from '$lib/components/layouts/LayoutHeader.svelte';
</script>

<LayoutHeader />

<Modal styleWindow={{width: "80vw"}} bind:show={$globalModalState} on:closed={()=>globalModalState.set(null)}>
	<ConnectionMaster/>
	<slot />
</Modal>
