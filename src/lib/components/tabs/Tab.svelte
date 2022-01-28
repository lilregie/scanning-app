<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';
    import { createEventDispatcher } from 'svelte';

    export let id: string = "";

    const dispatch = createEventDispatcher();

	const tab = {};
	const { registerTab, selectTab, selectedTab } = getContext(TABS);

	registerTab(tab,id);

</script>

<button class:selected="{$selectedTab === tab}" on:click="{() => {selectTab(tab);dispatch('selected', {})}}">
	<slot></slot>
</button>

<style lang="scss">
    @use '../../styles/vars.scss' as *;
	button {
        background: none;
		border: none;
		border-radius: 0;
		margin: 0;
        cursor: pointer;
        flex-grow: 1;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
        font-weight: bold;
        font-size: 1rem;
        transition: all 0.2s ease-in-out;
        padding: 0.5rem;
        color: $text-light;
		z-index: 2;
        &.selected {
            // Simulates 2px border-bottom, but dosen't cause CLS when animating
            box-shadow: 0px 2px 0px 0px map-get($theme-colors, 'primary');
            color: map-get($theme-colors, 'primary');

        }
        &:not(.selected) {
            opacity: 0.5;
        }
        &:hover {
            background-color: rgba( map-get($theme-colors, 'primary'), 0.1);
        }
	}
</style>