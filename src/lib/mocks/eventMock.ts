import type { Event } from '$lib/event';
import { generateAttendee } from '$lib/mocks/attendeeMock';

import faker from 'faker';

export function generateEvent(): Event {
	let id = faker.datatype.number();
	let paid = faker.datatype.boolean();
	let price = paid ? 0 : parseFloat(faker.commerce.price());
	let tax = price * 0.15;
	let attendees_count = faker.datatype.number(100);
	let attendees = [];
	for (let i = 0; i < attendees_count; i += 1) {
		attendees.push(generateAttendee());
	}
	return {
		id,
		reference: `${id} ${faker.commerce.productName()} Event`,
		completed_at: faker.date.past(),
		cancelled_at: null,
		early_bird: null,
		billing_first_name: null,
		billing_last_name: null,
		billing_email_address: null,
		billing_organisation: null,
		billing_position: null,
		billing_address: null,
		billing_address_city: null,
		billing_address_region: null,
		billing_address_post_code: null,
		billing_address_country: null,
		price_excluding_tax: price.toString(),
		tax: tax.toString(),
		price_including_tax: (price + tax).toString(),
		payment_type: faker.datatype.string(),
		invoice_numbers: [],
		xero_invoice_references: [],
		paid,
		purchase_order_number: null,
		attendees,
		amount_paid: '0.0',
		balance: '0.0',
		date_paid: null
	};
}
