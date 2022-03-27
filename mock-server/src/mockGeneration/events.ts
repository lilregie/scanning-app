import type { Eventlet, LilRegieEvent } from '../mockInterfaces/event';

import faker from '@faker-js/faker';

faker.seed(42);

const genID = () => faker.datatype.number();

export function generateEvent(event_type: 'attendee' | 'ticket_only'): LilRegieEvent {
    const standalone = faker.datatype.boolean();
    const evenletCount = standalone ? faker.datatype.number({
        min: 2,
        max: 10
    }) : 1;
    const eventID = genID();
	return {
		id: eventID,
		name: `Genned Event | ${event_type} | ${evenletCount} eventlets | #${eventID}`,
        permalink: faker.lorem.slug(),
        event_type,
        stand_alone: standalone,
        vaccine_pass_enabled: true,
        eventlets: generateEventlets(evenletCount),
        
	};
}

function generateEventlets(count: number): [Eventlet, ...Eventlet[]] {
    let eventlets: Eventlet[] = [];
    for (let i = 0; i < count; i++) {
        let ticket_limit = faker.datatype.number(400);
        let total_ticket_count = Math.round(faker.datatype.float(1) * ticket_limit);
        let center_time = faker.datatype.boolean() ? faker.date.recent(2) : faker.date.future(2);
        // override first eventlet to happen now
        center_time = faker.datatype.boolean() ? new Date() : center_time;
        eventlets.push({
            ticket_limit: faker.datatype.boolean() ? null : ticket_limit,
            checked_in_count: Math.round(faker.datatype.float(1) * faker.datatype.number(400)),
            id: genID(),
            name: faker.commerce.department(),
            total_ticket_count,
            datetime_start: new Date(center_time.getTime() - (1000 * 60 * 60 * faker.datatype.number(3))),
            datetime_end: new Date(center_time.getTime() + (1000 * 60 * 60 * faker.datatype.number(3))),
        })
    }
    return eventlets as [Eventlet, ...Eventlet[]];
}