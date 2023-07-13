<script lang="ts">
	import type { Eventlet } from '$lib/event';
	import { currentEvent, selectedEventletIDs } from '$lib/store';
	import dayjs from 'dayjs';
	import isBetween from 'dayjs/plugin/isBetween';
	import { createEventDispatcher, onDestroy, onMount, tick } from 'svelte';
	dayjs.extend(isBetween);

	import Select from 'svelte-select';
	import { derived, get, writable, type Readable, type Writable } from 'svelte/store';

	export let multiSelect = true;
	export let startingEventlets: Eventlet[] | Eventlet;
	export let eventletIDWhitelist: number[] | null = null;

	const dispatch = createEventDispatcher();

	let currentlyLoading = true;

	enum SelectorGroups {
		RightNow = 'Right Now',
		Past = 'Past',
		Future = 'Future'
	}

	let allEventlets: Writable<SelectorValue[]> = writable([]);
	$: {
		// We split the groups and order based on time
		let queueRightNow: SelectorValue[] = [];
		let queueFuture: SelectorValue[] = [];
		let queuePast: SelectorValue[] = [];
		$currentEvent?.eventlets?.map((eventlet) => {
			let optionEnabled = true;
			if (eventletIDWhitelist && !eventletIDWhitelist.includes(eventlet.id)) {
				optionEnabled = false;
			}

			const startDate = dayjs(eventlet.start_at).format('MMM DD, ha');
			let isRightnow = dayjs().isBetween(eventlet.start_at, eventlet.end_at);

			let group: SelectorGroups | null = null;
			if (isRightnow) {
				group = SelectorGroups.RightNow;
			} else if (dayjs().isAfter(eventlet.end_at)) {
				group = SelectorGroups.Past;
			} else {
				group = SelectorGroups.Future;
			}

			const item: SelectorValue = {
				value: eventlet.id,
				label: `${eventlet.name} (${startDate})`,
				group: group,
				startTime: eventlet.start_at,
				selectable: optionEnabled
			};

			switch (group) {
				case 'Right Now':
					queueRightNow.push(item);
					break;
				case 'Past':
					queuePast.push(item);
					break;
				case 'Future':
					queueFuture.push(item);
					break;
			}
		});
		const startSort = (a: SelectorValue, b: SelectorValue) => {
			return a.startTime.getTime() - b.startTime.getTime();
		};
		allEventlets.set([
			...queueRightNow.sort(startSort),
			...queueFuture.sort(startSort),
			...queuePast.sort(startSort).reverse()
		]);
	}

	$: groupBy = (item: SelectorValue) => item.group;

	export let selectedValues: Writable<SelectorValue[] | SelectorValue> = writable([]);

	async function force_update_selected(
		_allEventlets: SelectorValue[],
		_startingEventlets: Eventlet[] | Eventlet | null
	) {
		let new_values = _allEventlets.filter((eventlet) => {
			if (!Array.isArray(_startingEventlets)) {
				return _startingEventlets?.id == eventlet.value;
			} else {
				return _startingEventlets.map((e) => e.id).includes(eventlet.value);
			}
		});
		if (multiSelect) {
			selectedValues.set(new_values.length > 0 ? new_values : null);
		} else {
			selectedValues.set(new_values[0] ?? null);
		}
		currentlyLoading = true;
		await tick();
		currentlyLoading = false;

		console.log('Selected values: ', $selectedValues);
	}

	$: force_update_selected($allEventlets, startingEventlets);

	function newSelection() {
		let eventletIDS: number[] = [];
		const currentValues = get(selectedValues);
		if (Array.isArray(currentValues)) {
			eventletIDS = currentValues.map((v) => v.value) || [];
		} else if (typeof currentValues === 'object') {
			eventletIDS = [currentValues.value];
		}

		const eventlets = eventletIDS.map((id: number) => {
			return get(currentEvent)?.eventlets?.find((eventlet: Eventlet) => {
				return eventlet.id === id;
			});
		});
		console.log('New selection: ', eventlets);
		dispatch('select', eventlets);
	}
</script>

<div class="select">
	{#key currentlyLoading}
		<Select
			items={$allEventlets}
			multiple={multiSelect}
			placeholder={`Select ${multiSelect ? '' : 'an '}Eventlet${multiSelect ? 's' : ''}...`}
			bind:value={$selectedValues}
			on:select={newSelection}
			searchable={false}
			loading={currentlyLoading}
			{groupBy}
		>
			<div slot="empty">All eventlets are selected</div>
		</Select>
	{/key}
</div>

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	.select {
		color: $text-dark;
		z-index: 2;
		width: 100%;

		--border: 3px solid white;
		--background: #{$background-backdrop};
		--list-background: #{$background-intermediate-dark};
		--item-hover-bg: #{$background-intermediate-light};
		--item-hover-color: #{$text-light};
		--border-focus: 3px solid #{map-get($theme-colors, 'primary')};
		--multi-item-bg: #{$background-foreground};
		--border-radius: 0.5rem;
		--placeholder-color: #{$text-dark};
		--spinner-color: #{map-get($theme-colors, 'primary')};
		--list-empty-color: #{$text-dark};
		--group-title-color: #a7a7a7;

		// Libaray missing multiItemColor
		:global(.multiSelectItem_label) {
			color: #{$text-light};
		}

		// Make all the buttons have a pointer cursor
		:global(.listItem > .item) {
			cursor: pointer;
		}
		:global(.clearSelect) {
			cursor: pointer;
		}
		:global(.selectContainer) {
			cursor: pointer;
		}
		:global(input) {
			cursor: pointer;
		}
		:global(.multiSelectItem_clear) {
			cursor: pointer;
		}
		:global(.notSelectable) {
			text-decoration: line-through;
		}
	}

	@media screen and (max-width: $breakpoint-mobile) {
		.select {
			width: 100%;
			--listMaxHeight: 12em;
		}
	}
</style>
