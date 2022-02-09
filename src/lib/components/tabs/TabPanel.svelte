<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	export let id: string = '';

	const panel = {};
	const { registerPanel, selectedPanel } = getContext(TABS);

	registerPanel(panel, id);
</script>

{#if $selectedPanel === panel}
	<div class="pannel">
		<slot />
	</div>
{/if}

<style lang="scss">
	@use '../../styles/vars.scss' as *;
	.pannel {
		outline: 2px solid $background-intermediate-light;
		margin-top: 2px;
	}
</style>
