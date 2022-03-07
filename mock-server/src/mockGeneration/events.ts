import type { LilRegieEvent } from '../mockInterfaces/event';

import faker from '@faker-js/faker';

faker.seed(42);

const genID = () => faker.datatype.number();

export function generateEvent(): LilRegieEvent {
	return {
		id: genID(),
		name: faker.commerce.productName(),
        permalink: faker.lorem.slug(),
        not_checked_in_count: faker.datatype.number(),
        checked_in_count: faker.datatype.number(),
        checkinable_count: faker.datatype.number(),
        ticket_limit: faker.datatype.boolean() ? null : faker.datatype.number(400),
	};
}
