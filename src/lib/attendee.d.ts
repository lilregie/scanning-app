export interface Attendee {
	id: number;
	booking_id: number;
	first_name: string;
	last_name: string;
	contact_phone?: any;
	email_address?: string;
	organisation?: string;
	position?: any;
	requirements?: string;
	ticket_type_id: number;
	ticket_type_name: string;
	attendee_type_id: number;
	attendee_type_name: string;
	custom_fields: CustomField[];
	attendances: Attendance[];
	cancelled_at?: any;
	voucher_name?: any;
}
export interface CustomField {
	name: string;
	input_type: string;
	values: string[];
}

export interface Attendance {
	eventlet_name: string;
	amount_excluding_tax: string;
	tax: string;
	amount_including_tax: string;
}
