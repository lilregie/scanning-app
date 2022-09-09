export interface Attendee {
   id: number;
   booking_id: number;
   ticket_id: number;
   ticket_type_id: number;
   ticket_type_name: string;
   attendee_type_id: number;
   attendee_type_name: string;
   // Overall check-in status
   checked_in_at: Date | null;
   attendances: EventletAttendance[];
   cancelled_at: Date | null;
   voucher_name: string | null;
   ticket_uuid: string;
	// A booking can for more than one person.
	// The sequence number thus indicates the continuous
	// numbering of those tickets/attendances on that booking.
	ticket_sequence: number;
   vaccine_pass: boolean;
   
}

// Details not collected in a ticket only event
export interface AttendeePersonal {
   first_name: string;
   last_name: string;
   contact_phone: string | null;
   email_address: string | null;
   organisation: string | null;
   position: string | null;
   requirements: string | null;
   custom_fields: CustomField[];
}

export interface CustomField {
   name: string;
   input_type: string;
   values: string[];
}

export interface EventletAttendance {
	id: number;
	attendee_id: number;
	eventlet_id: number;
	eventlet_name: string;
	amount_excluding_tax: string;
	tax: string;
	amount_including_tax: string;
	checked_in_at: Date | null;
	checkin_user_id: number;
}