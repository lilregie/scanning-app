import type { Attendee } from '$lib/attendee';

export interface Event {
    id: string;
    name: string;
    permalink: string;
    not_checked_in_count: number;
    checked_in_count: number;
    checkinable_count: number;
}