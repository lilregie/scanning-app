export interface Attendee {
	id: number;
	booking_id: number;
	ticket_id: number;
	first_name: string;
	last_name: string;
	contact_phone: string | null;
	email_address: string | null;
	organisation: string | null;
	position: string | null;
	requirements: string | null;
	ticket_type_id: number;
	ticket_type_name: string;
	attendee_type_id: number;
	attendee_type_name: string;
	custom_fields: CustomField[];
	checked_in_at: Date | null;
	attendances: Attendance[];
	cancelled_at: Date | null;
	voucher_name: string | null;
	vaccine_pass: boolean;
}
export interface CustomField {
	name: number;
	input_type: string;
	values: string[];
}

export interface Attendance {
	id: number;
	eventlet_id: number;
	eventlet_name: string;
	amount_excluding_tax: string;
	tax: string;
	amount_including_tax: string;
	ticket_number: number;
	ticket_sequence: number;
}
