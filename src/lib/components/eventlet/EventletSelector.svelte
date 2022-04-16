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
    export let startingEventlets: Writable<Eventlet[]>;

    const dispatch = createEventDispatcher();

    let currentlyLoading = true;

    enum SelectorGroups {
        RightNow = 'Right Now',
        Past = 'Past',
        Future = 'Future',
    }

    interface SelectorValue {
        value: number,
        label: `${string} (${string})`,
        group: SelectorGroups,
        startTime: Date

    }

	let allEventlets: Writable<SelectorValue[]> = writable([]);
	$: {
		// We split the groups and order based on time
		let queueRightNow: SelectorValue[] = [];
		let queueFuture: SelectorValue[] = [];
		let queuePast: SelectorValue[] = [];
		$currentEvent?.eventlets?.map((eventlet) => {
			const startDate = dayjs(eventlet.datetime_start).format('MMM DD, ha');
			let isRightnow = dayjs().isBetween(eventlet.datetime_start, eventlet.datetime_end);

			let group: SelectorGroups = null;
			if (isRightnow) {
				group = SelectorGroups.RightNow;
			} else if (dayjs().isAfter(eventlet.datetime_end)) {
				group = SelectorGroups.Past;
			} else {
				group = SelectorGroups.Future;
			}

			const item: SelectorValue = {
				value: eventlet.id,
				label: `${eventlet.name} (${startDate})`,
				group: group,
				startTime: eventlet.datetime_start
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

    let selectedValues: Writable<SelectorValue[]> = writable([]);

    async function force_update_selected (_allEventlets: SelectorValue[], _startingEventlets: Eventlet[]) {
        selectedValues.set(_allEventlets.filter((eventlet) => {
            return _startingEventlets.map((e)=>e.id).includes(eventlet.value);
        }));
        currentlyLoading = true;
        await tick();
        currentlyLoading = false;

        console.log("Selected values: ", $selectedValues);
    }

    $: force_update_selected($allEventlets,$startingEventlets)


    function newSelection() {
        const eventletIDS = $selectedValues?.map((v) => v.value) || [];
        const eventlets = eventletIDS.map((id: number)=> {
                return get(currentEvent).eventlets.find((eventlet: Eventlet) => {
                    return eventlet.id === id;
            })
        })
        console.log("New selection: ", eventlets);
        dispatch("select", eventlets);
    }

</script>

<div class="container">
	<div class="header">Choose your eventlets</div>
	<div class="select">
        {#key currentlyLoading}
            <Select
                items={$allEventlets}
                isMulti={multiSelect}
                placeholder={'Select Eventlets...'}
                bind:value={$selectedValues}
                on:select={newSelection}
                isSearchable={false}
                isWaiting={currentlyLoading}
                {groupBy}
                listPlacement="bottom"
                noOptionsMessage={'All eventlets are selected'}
            />
        {/key}
        {JSON.stringify(selectedValues)}
	</div>
</div>

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		height: 100%;
		.header {
			font-size: 2rem;
			margin: 1rem;
			text-align: center;
		}
		.select {
			width: 80%;
			margin-bottom: 2em;
			z-index: 2;

			--border: 3px solid white;
			--background: #{$background-backdrop};
			--listBackground: #{$background-intermediate-dark};
			--itemHoverBG: #{$background-intermediate-light};
			--itemHoverColor: #{$text-light};
			--borderFocusColor: #{map-get($theme-colors, 'primary')};
			--multiItemBG: #{$background-foreground};
			--multiItemActiveBG: #{$background-intermediate-light};
			--borderRadius: 0.5rem;
			--placeholderColor: #{$text-dark};
			--spinnerColor: #{map-get($theme-colors, 'primary')};
			--listEmptyColor: #{$text-dark};
			--groupTitleColor: #a7a7a7;
			--clearSelectFocusColor: #{map-get($theme-colors, 'primary')};
			--clearSelectHoverColor: #{$text-dark};

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
		}

		@media screen and (max-width: $breakpoint-mobile) {
			.header {
				font-size: 1.25rem;
			}
			.select {
				width: 100%;
				--listMaxHeight: 12em;
			}
		}
	}
</style>
