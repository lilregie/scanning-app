<script lang="ts">
	import { currentEvent, eventletAttendees, selectedEventletIDs } from '$lib/store';
	import dayjs from 'dayjs';
    import isBetween from 'dayjs/plugin/isBetween';
import { onDestroy, onMount } from 'svelte';
    dayjs.extend(isBetween)

	import Select from 'svelte-select';
import { writable } from 'svelte/store';

    let allEventlets = writable([]);
	$: {
        // We split the groups and order based on time
        let queueRightNow = [];
        let queueFuture = [];
        let queuePast = [];
		$currentEvent?.eventlets?.map((eventlet) => {
			const startDate = dayjs(eventlet.datetime_start).format('MMM DD, h:mm A');
            let isRightnow = dayjs().isBetween(eventlet.datetime_start, eventlet.datetime_end);
            
            let group = "";
            if (isRightnow) {
                group = "Right Now";
            } else if (dayjs().isAfter(eventlet.datetime_end)) {
                group = "Past";
            } else {
                group = "Future";
            }


			const item = {
				value: eventlet.id,
				label: `${eventlet.name} (${startDate})`,
                group: group,
                startTime: eventlet.datetime_start
			};

            switch (group) {
                case "Right Now":
                    queueRightNow.push(item);
                    break;
                case "Past":
                    queuePast.push(item);
                    break;
                case "Future":
                    queueFuture.push(item);
                    break;
            }
		});
        const startSort = (a, b) => {
            return a.startTime - b.startTime;
        }
        allEventlets.set([...queueRightNow.sort(startSort), ...queueFuture.sort(startSort), ...queuePast.sort(startSort).reverse()]);
    }

    $: groupBy = (item) => item.group

	let selectedValues;

	function newSelection() {
		selectedEventletIDs.set(selectedValues?.map((v) => v.value) || []);
	}
    const desubEventlets = allEventlets.subscribe((_allEventlets)=> {
        const possibleSelection = $selectedEventletIDs.map((id) => _allEventlets.find((eventlet) => eventlet.value === id)).filter((e)=>e);
        console.log("asdasd",$allEventlets)

        if (possibleSelection.length > 0) {
            selectedValues = possibleSelection;
        }
    });

    onDestroy(()=>{
        desubEventlets()
    })
</script>

<div class="container">
	<div class="header">Choose your eventlets</div>
	<div class="select">
		<Select
			items={$allEventlets}
			isMulti
			placeholder={'Select Eventlets...'}
			bind:value={selectedValues}
			on:select={newSelection}
            isSearchable={false}
            isWaiting={!$currentEvent}
            {groupBy}
            listPlacement="bottom"
            noOptionsMessage={"All eventlets are selected"}

		/>
	</div>
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		height: 100%;
		.header {
			font-size: 2rem;
			margin: 1rem;
		}
		.select {
			width: 80%;
            --border: 3px solid white;
            --background: none;
            --listBackground: #{$background-intermediate-dark};
            --itemHoverBG: #{$background-intermediate-light};
            --itemHoverColor: #{$text-light};
            --borderFocusColor: #{map-get($theme-colors, "primary")};
            --multiItemBG: #{$background-foreground};
            --multiItemActiveBG: #{$background-intermediate-light};
            --borderRadius: 0.5rem;
            --placeholderColor: #{$text-dark};
            --spinnerColor: #{map-get($theme-colors, "primary")};
            --listEmptyColor: #{$text-dark};
            --groupTitleColor:  #a7a7a7;

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
	}
</style>
