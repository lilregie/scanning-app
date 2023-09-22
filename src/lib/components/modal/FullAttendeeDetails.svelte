<script lang="ts">
	import type { Attendee, EventletAttendance } from '$lib/attendee'
	import type { Booking } from '$lib/booking'
	import type { Readable } from 'svelte/store'

	import AttendeeDetails from '../AttendeeDetails.svelte'
	import type { LilRegieEvent } from '$lib/event'
	import type { Errors } from '$lib/errors';

	export let attendance: EventletAttendance | null = null
	export let attendee: Readable<Attendee>
	export let booking: Booking
	export let event: LilRegieEvent
	export let errors: Errors | null = null
	export let selectedEventletId: number | null = null
</script>

<AttendeeDetails
	{ attendance }
	{ attendee }
	{ booking }
	{ event }
	{ errors }
	{ selectedEventletId }
/>
