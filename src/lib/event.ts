export interface EventDetails {
	id: number;
	name: string;
	event_type: "ticket_only" | "registration";
	permalink: string;
	// decides if we should display the eventlet UI elements
	standalone: boolean;
}

export interface LilRegieEvent extends EventDetails {
	// events can contain multiple datetimes - like a multi-day event
	eventlets: [EventletSingle, ...EventletSingle[]]; // Min of one eventlet
	// required for NZ events - but not for other countries
	vaccine_pass_required: boolean;
}

export interface EventletSingle {
	id: number;
	name: string;
	details_url: string;
	event_id: number;
	// users can set a max total number of tickets for this event
	maximum_attendees: number | null;
	checked_in_count: number;
	confirmed_attending_count: number;
	total_attendee_count: number;

	// when the eventlet itself is running
	start_at: Date;
	end_at: Date;
	extra_details: string;
	position: number;
	subtitle: string;
	subtitle_url: string;
}

export interface EventletsCombined {
	id: number[];
	name: string[];
	event_id: number;
	// users can set a max total number of tickets for this event
	maximum_attendees: number | null;
	checked_in_count: number;
	confirmed_attending_count: number;
	total_attendee_count: number;

	// when the eventlet itself is running
	start_at: Date;
	end_at: Date;
}

export type Eventlet = EventletSingle | EventletsCombined;
