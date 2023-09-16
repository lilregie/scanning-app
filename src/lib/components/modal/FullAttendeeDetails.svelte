<script lang="ts">
	import type { Attendee } from '$lib/attendee'
	import type { Readable } from 'svelte/store'

	import AttendeeDetails from '../AttendeeDetails.svelte'
	import type { LilRegieEvent } from '$lib/event'

	export let attendee: Readable<Attendee>
	export let event: LilRegieEvent
</script>

<AttendeeDetails { attendee } { event } />
