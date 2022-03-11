import type { Attendee, Attendance, CustomField } from '../mockInterfaces/attendee';

import faker from '@faker-js/faker';
faker.seed(42);


const genID = () => faker.datatype.number(99999);
function maybe<T>(x: T): T | null {
	return faker.datatype.boolean() ? x : null;
}

export function generateAttendeesForEvent(): Attendee[] {
	let people = [];
	for (let i = 0; i < faker.datatype.number(70) + 12; i++) {
		people.push(generateAttendee(((i+1)*137)));
	}
	return people;
}


export function generateAttendee(id: number = genID()): Attendee {
	let checkInCount = faker.datatype.boolean() ? 0 : faker.datatype.number(3);
	return {
		id,
		booking_id: genID(),
        ticket_id: genID(),
		first_name: faker.name.firstName(),
		last_name: faker.name.lastName(),
		contact_phone: maybe(faker.phone.phoneNumber()),
		email_address: maybe(faker.internet.email()),
		organisation: maybe(faker.company.companyName()),
		position: maybe(faker.name.jobType()),
		requirements: maybe(faker.datatype.boolean() ? faker.lorem.sentence() : null),
		ticket_type_id: faker.datatype.number(),
		ticket_type_name: faker.datatype.boolean() ? "Early Bird" : "Standard",
		attendee_type_id: faker.datatype.number(),
		attendee_type_name: faker.datatype.boolean() ? "Student" : "Standard",
		custom_fields: generateCustomFeilds(faker.datatype.number(3)),
		attendances: generateAttendances(checkInCount),
		cancelled_at: null,
		voucher_name: null,
        checked_in_at: maybe(faker.date.recent(2)),
		vaccine_pass: false,
	};
}

export function generateAttendances(count: number) {
	let attendances: Attendance[] = []
	for (let i=0; i < count; i++) {
		attendances.push({
            id: genID(),
            eventlet_id: genID(),
            eventlet_name: faker.datatype.string(),
            amount_excluding_tax: faker.datatype.string(),
            tax: faker.datatype.string(),
            amount_including_tax: faker.datatype.string(),
            ticket_number: faker.datatype.number(9999),
            ticket_sequence: faker.datatype.number(3)
         
		})
	}
	return attendances
}

function generateCustomFeilds(count: number): CustomField[] {
	let customFields: CustomField[] = []
	for (let i = 0; i < count; i++) {
		customFields.push({
			input_type: faker.datatype.string(),
			name: genID(),
			values: faker.datatype.boolean() ? [faker.lorem.sentence()] : [faker.lorem.sentence(),faker.lorem.sentence()],
		})
	}

	return customFields;
}
