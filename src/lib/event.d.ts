import type { Attendee } from '$lib/attendee';

export interface Event {
	id: number;
	reference: string;
	completed_at: Date;
	cancelled_at?: any;
	early_bird?: any;
	billing_first_name?: any;
	billing_last_name?: any;
	billing_email_address?: any;
	billing_organisation?: any;
	billing_position?: any;
	billing_address?: any;
	billing_address_city?: any;
	billing_address_region?: any;
	billing_address_post_code?: any;
	billing_address_country?: any;
	price_excluding_tax: string;
	tax: string;
	price_including_tax: string;
	payment_type: string;
	invoice_numbers: any[];
	xero_invoice_references: any[];
	paid: boolean;
	purchase_order_number?: any;
	attendees: Attendee[];
	amount_paid: string;
	balance: string;
	date_paid?: any;
}
