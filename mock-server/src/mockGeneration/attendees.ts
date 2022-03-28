import type { Attendee, EventletAttendance, CustomField, AttendeePersonal } from '../mockInterfaces/attendee';

import {faker} from '@faker-js/faker';
import { LilRegieEvent } from '../mockInterfaces/event';

faker.seed(42);


const genID = () => faker.datatype.number(99999);
function maybe<T>(x: T): T | null {
	return faker.datatype.boolean() ? x : null;
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
	return array;
}

export function generateAttendeesForEvent(event: LilRegieEvent): Attendee[] {
	let people = [];
	for (let i = 0; i < faker.datatype.number(70) + 12; i++) {
		people.push(generateAttendee(((i+1)*137), event));
	}
	return people;
}


export function generateAttendee(id: number = genID(), event: LilRegieEvent): Attendee | Attendee & AttendeePersonal {
	let checked_in = faker.datatype.boolean();

	let attendeePersonal: AttendeePersonal | {} = {}
	if (event.event_type === 'attendee') {
		attendeePersonal = {
			first_name: faker.name.firstName(),
			last_name: faker.name.lastName(),
			contact_phone: maybe(faker.phone.phoneNumber()),
			email_address: maybe(faker.internet.email()),
			organisation: maybe(faker.company.companyName()),
			position: maybe(faker.name.jobType()),
			requirements: maybe(faker.datatype.boolean() ? faker.lorem.sentence() : null),
			custom_fields: generateCustomFeilds(faker.datatype.number(3)),
		}
	}

	return {
		id,
		booking_id: genID(),
        ticket_id: genID(),
		ticket_type_id: faker.datatype.number(),
		ticket_type_name: faker.datatype.boolean() ? "Early Bird" : "Standard",
		attendee_type_id: faker.datatype.number(),
		attendee_type_name: faker.datatype.boolean() ? "Student" : "Standard",
		attendances: generateAttendances(event, checked_in),
		cancelled_at: null,
		voucher_name: null,
        checked_in_at: checked_in ? faker.date.recent(2) : null,
		vaccine_pass: faker.datatype.number(2)==1,
		...attendeePersonal,
	};
}

export function generateAttendances(event: LilRegieEvent, checked_in: boolean) {
	let attendances: EventletAttendance[] = [];
	let count = faker.datatype.number(event.eventlets.length);

	let chosenEventlets = shuffleArray(event.eventlets).slice(0, count);
	
	for (let i=0; i < count; i++) {
		attendances.push({
            id: genID(),
            eventlet_id: chosenEventlets[i].id,
            eventlet_name: chosenEventlets[i].name,
            amount_excluding_tax: faker.datatype.string(),
            tax: faker.datatype.string(),
            amount_including_tax: faker.datatype.string(),
            ticket_number: faker.datatype.number(9999),
            ticket_sequence: faker.datatype.number(3),
			checked_in_at: checked_in && (faker.datatype.boolean() || i===0) ? faker.date.recent(2) : null,
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
