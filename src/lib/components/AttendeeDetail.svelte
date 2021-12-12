<script lang="ts">
    import Button from "$lib/components/Button.svelte";

    import type { Attendee } from "$lib/attendee";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let attendee: Attendee;

    function checkIn() {
		dispatch('checkIn', {});
	}
</script>

{JSON.stringify(attendee)}
<Button on:click={checkIn}>Check In</Button>