<script lang="ts">
import type { Eventlet } from '$lib/event';

	import { currentEvent, eventletAttendees, selectedEventletIDs as globalSelectedEventletIDs } from '$lib/store';
	import dayjs from 'dayjs';
	import isBetween from 'dayjs/plugin/isBetween';
	import { onDestroy, onMount } from 'svelte';
	dayjs.extend(isBetween);

	import Select from 'svelte-select';
	import { get, writable } from 'svelte/store';
	import EventletSelector from './EventletSelector.svelte';

    const startingEventlets = writable<Eventlet[]>([]);
    $: startingEventlets.set($globalSelectedEventletIDs.map((id: number)=> {
        return get(currentEvent).eventlets.find((eventlet: Eventlet) => {
            return eventlet.id === id;
        });
    }))

    function updateGlobalEventlets(detail:{detail: Eventlet[]}) {
        console.log("Updated eventlets: ", detail);
        globalSelectedEventletIDs.set(detail.detail.map((eventlet: Eventlet) => {
            return eventlet.id;
        }));
    };

</script>

<EventletSelector multiSelect={true} on:select={updateGlobalEventlets} startingEventlets={startingEventlets}/>
