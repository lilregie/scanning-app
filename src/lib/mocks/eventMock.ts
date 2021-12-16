import type { Event } from '$lib/event';
import { generateAttendee } from '$lib/mocks/attendeeMock';

import faker from 'faker';

faker.seed(42);

export function generateEvent(): Event {
	let id = faker.datatype.number();
	let attendees_count = faker.datatype.number(100);
	let attendees = [];
	for (let i = 0; i < attendees_count; i += 1) {
		attendees.push(generateAttendee());
	}
	return {
		id,
		reference: `${id} ${faker.commerce.productName()} Event`,
		total_tickets: Math.round(attendees_count*(faker.datatype.number(200)/100+1)),
	};
}
