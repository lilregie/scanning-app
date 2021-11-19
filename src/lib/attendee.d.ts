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
	check_ins: CheckIn[];
	cancelled_at?: any;
	voucher_name?: any;
}
export interface CustomField {
	name: string;
	input_type: string;
	values: string[];
}

export interface CheckIn {
	time: Date;
	id: number;
	attendee_id: number;
	vaccine_certificate: string?;
	ticket_id: string?;
	manually_checked_in: boolean;
}