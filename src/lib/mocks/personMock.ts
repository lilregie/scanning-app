import faker from "faker";

import type { Person, CustomField } from "$lib/person"

export function generateLatestCheckIns(count: number): Person[] {
    let people = []
    for (let i = 0; i < count; i++) {
        people.push(generatePerson())
    }
    return people
}

export function generatePerson(): Person {
    return {
        id: faker.datatype.number(),
        booking_id: faker.datatype.number(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        contact_phone: faker.phone.phoneNumber(),
        email_address: faker.internet.email(),
        organisation: faker.company.companyName(),
        position: null,
        requirements: null,
        ticket_type_id: faker.datatype.number(),
        ticket_type_name: faker.commerce.productName(),
        attendee_type_id: faker.datatype.number(),
        attendee_type_name: faker.datatype.string(),
        custom_fields: [],
        attendances: [],
        cancelled_at: null,
        voucher_name: null,
    }
}