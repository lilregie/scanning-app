import type { LilRegieEvent } from '../mockInterfaces/event';

import faker from '@faker-js/faker';

faker.seed(42);

const genID = () => faker.datatype.number().toString();

export function generateEvent(): LilRegieEvent {
	return {
		id: genID(),
		name: faker.commerce.productName(),
        permalink: faker.lorem.slug(),
        not_checked_in_count: faker.datatype.number(),
        checked_in_count: faker.datatype.number(),
        checkinable_count: faker.datatype.number()
	};
}