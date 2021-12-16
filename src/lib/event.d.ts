import type { Attendee } from '$lib/attendee';

export interface Event {
	id: number;
	reference: string;
	total_tickets: number;
}
