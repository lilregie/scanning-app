import faker from 'faker';

import type { CheckIn, Attendee, CustomField } from '$lib/attendee';

export function generateAttendeesForEvent({count = (faker.datatype.number(40)+12), forceCheckIns = false}={}): Attendee[] {
	let people = [];
	for (let i = 0; i < count; i++) {
		people.push(generateAttendee({forceCheckIns}));
	}
	return people;
}

faker.seed(42);

export function generateAttendee({
	firstName = faker.name.firstName(),
	lastName = faker.name.lastName(),
	forceCheckIns = false
  }={}): Attendee {
	let id  = faker.datatype.number();
	let checkInCount = forceCheckIns ? 1 : (faker.datatype.boolean() ? 0 : faker.datatype.number(3));
	return {
		id,
		booking_id: faker.datatype.number(),
		first_name: firstName,
		last_name: lastName,
		contact_phone: faker.phone.phoneNumber(),
		email_address: faker.internet.email(),
		organisation: faker.company.companyName(),
		position: null,
		requirements: faker.datatype.boolean() ? faker.lorem.sentence() : null,
		ticket_type_id: faker.datatype.number(),
		ticket_type_name: faker.commerce.productName(),
		attendee_type_id: faker.datatype.number(),
		attendee_type_name: faker.datatype.string(),
		custom_fields: [],
		check_ins: generateCheckIns(checkInCount,id),
		cancelled_at: null,
		voucher_name: null
	};
}

export function generateCheckIns(count: number, attendee_id: number) {
	let attendances: CheckIn[] = []
	for (let i=0; i < count; i++) {
		let vaccine_certificate = faker.datatype.boolean() ? generateVaccineCertificate() : null;
		let ticket_id = faker.datatype.boolean() ? faker.datatype.uuid() : null;
		let manually_checked_in = ticket_id === null && vaccine_certificate === null
		attendances.push({
			time: faker.date.recent(0.25),
			id: faker.datatype.number(),
			vaccine_certificate,
			ticket_id,
			manually_checked_in,
			attendee_id
		})
	}
	return attendances
}

function generateVaccineCertificate() {
	return "NZCP:/1/2KCEVIQEIVVWK6JNGEASNICZAEP2KALYDZSGSZB2O5SWEOTOPJRXALTDN53GSZBRHEXGQZLBNR2GQLTOPICRUYMBTIFAIGTUKBAAUYTWMOSGQQDDN5XHIZLYOSBHQJTIOR2HA4Z2F4XXO53XFZ3TGLTPOJTS6MRQGE4C6Y3SMVSGK3TUNFQWY4ZPOYYXQKTIOR2HA4Z2F4XW46TDOAXGG33WNFSDCOJONBSWC3DUNAXG46RPMNXW45DFPB2HGL3WGFTXMZLSONUW63TFGEXDALRQMR2HS4DFQJ2FMZLSNFTGSYLCNRSUG4TFMRSW45DJMFWG6UDVMJWGSY2DN53GSZCQMFZXG4LDOJSWIZLOORUWC3CTOVRGUZLDOSRWSZ3JOZSW4TTBNVSWISTBMNVWUZTBNVUWY6KOMFWWKZ2TOBQXE4TPO5RWI33CNIYTSNRQFUYDILJRGYDVAYFE6VGU4MCDGK7DHLLYWHVPUS2YIDJOA6Y524TD3AZRM263WTY2BE4DPKIF27WKF3UDNNVSVWRDYIYVJ65IRJJJ6Z25M2DO4YZLBHWFQGVQR5ZLIWEQJOZTS3IQ7JTNCFDX"
}