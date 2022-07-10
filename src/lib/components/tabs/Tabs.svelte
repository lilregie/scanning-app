<script context="module" lang="ts">
	export const TABS = {};
</script>

<script lang="ts">
	import type {Writable } from 'svelte/store';

	import { setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	export let defualtTab: string = null;

	const tabs: {}[] = [];
	const panels = [];
	const selectedTab: Writable<{}> = writable(null);
	const selectedPanel: Writable<{}> = writable(null);

	// This works off how JS has very dodgy equality
	// Each Tab and Pannel create their own unique empty object
	// and two objects are equal if they have the same reference, not values
	// These refrences are used like unique ID's

	setContext(TABS, {
		registerTab: (tab: {}, id: string) => {
			tabs.push(tab);

			if (defualtTab) {
				if (defualtTab === id) {
					selectedTab.set(tab);
				}
				// If dosen't match, do nothing
			} else {
				selectedTab.update(current => current || tab);
			}
			
			onDestroy(() => {
				const i = tabs.indexOf(tab);
				tabs.splice(i, 1);
				selectedTab.update(current => current === tab ? (tabs[i] || tabs[tabs.length - 1]) : current);
			});
		},

		registerPanel: (panel: {}, id: string) => {
			panels.push(panel);

			if (defualtTab) {
				if (defualtTab === id) {
					selectedPanel.set(panel);
				}
				// If dosen't match, do nothing
			} else {
				selectedPanel.update(current => current || panel);
			}
			
			onDestroy(() => {
				const i = panels.indexOf(panel);
				panels.splice(i, 1);
				selectedPanel.update(current => current === panel ? (panels[i] || panels[panels.length - 1]) : current);
			});
		},

		selectTab: (tab: {}) => {
			const i = tabs.indexOf(tab);
			selectedTab.set(tab);
			selectedPanel.set(panels[i]);
		},

		selectedTab,
		selectedPanel
	});
</script>

<div class="tabs">
	<slot></slot>
</div>