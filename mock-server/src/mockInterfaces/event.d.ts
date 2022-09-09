export interface LilRegieEvent {
    id: number;
    name: string;
    // some events are fully managed by the regie ("registration"),
    // others are just using Lil Regie for ticketing ("ticket_only").
    event_type: "ticket_only" | "registration";
    // snake case version of name - used for signup URL
    permalink: string;
    // decides if we should display the eventlet UI elements
    standalone: boolean;
    // events can contain multiple datetimes - like a multi-day event
    eventlets: [Eventlet, ...Eventlet[]]; // Min of one eventlet
    // required for NZ events - but not for other countries
    vaccine_pass_required: boolean;
} 

export interface Eventlet {
    id: number;
    name: string;
    details_url: string;
    event_id: number;
    // users can set a max total number of tickets for this event
    maximum_attendees: number | null;
    checked_in_count: number;
    total_attendee_count: number;
    
    // when the eventlet itself is running
    start_at: Date;
    end_at: Date;
    extra_details: string;
    position: number;
    subtitle: string;
    subtitle_url: string;
}