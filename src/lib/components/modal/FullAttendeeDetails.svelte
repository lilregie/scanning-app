<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	import type { Readable } from 'svelte/store';

	import AttendeeDetails from '../AttendeeDetails.svelte';

	export let attendee: Readable<Attendee>;
</script>

<AttendeeDetails {attendee} direction={'vertical'} actionsAvailable={false} />
