export interface LilRegieEvent {
    id: number;
    name: string;
    // some events are fully managed by the regie ("attendee"),
    // others are just using Lil Regie for ticketing ("ticket_only").
    event_type: "ticket_only" | "attendee";
    // snake case version of name - used for signup URL
    permalink: string;
    // decides if we should display the eventlet UI elements
    stand_alone: boolean;
    // events can contain multiple datetimes - like a multi-day event
    eventlets: [Eventlet, ...Eventlet[]]; // Min of one eventlet
    // required for NZ events - but not for other countries
    vaccine_pass_enabled: boolean;
} 

export interface Eventlet {
    id: number;
    name: string;
    // users can set a max total number of tickets for this event
    ticket_limit: number | null;
    checked_in_count: number;
    total_ticket_count: number;
    // when the eventlet itself is running
    datetime_start: Date;
    datetime_end: Date;
}