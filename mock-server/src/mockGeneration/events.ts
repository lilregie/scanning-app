import type { Eventlet, LilRegieEvent } from '../mockInterfaces/event';

import {faker} from '@faker-js/faker';

faker.seed(42);

const genID = () => faker.datatype.number();

export function generateEvent(event_type: 'registration' | 'ticket_only'): LilRegieEvent {
    const standalone = faker.datatype.number(3)===1;
    const eventletCount = standalone ? 1 : faker.datatype.number({
        min: 1,
        max: 10
    });
    const vaccine_pass_required = faker.datatype.boolean();
    const eventID = genID();
	return {
		id: eventID,
		name: `${event_type} | ${standalone ? "standalone" : `${eventletCount} eventlets`} | VP-${vaccine_pass_required} | #${eventID}`,
        permalink: faker.lorem.slug(),
        event_type,
        standalone: standalone,
        vaccine_pass_required,
        eventlets: generateEventlets(eventletCount, eventID),
        
	};
}

function generateEventlets(count: number, event_id: number): [Eventlet, ...Eventlet[]] {
    const eventlets: Eventlet[] = [];
    for (let i = 0; i < count; i++) {
        const ticket_limit = faker.datatype.number(400);
        const total_attendee_count = Math.round(faker.datatype.float(1) * ticket_limit);
        let center_time = faker.datatype.boolean() ? faker.date.recent(2) : faker.date.future(2);
        // override first eventlet to happen now
        center_time = faker.datatype.boolean() ? new Date() : center_time;
        eventlets.push({
            maximum_attendees: faker.datatype.boolean() ? null : ticket_limit,
            checked_in_count: Math.round(faker.datatype.float(1) * total_attendee_count),
            id: genID(),
            event_id,
            name: capitalizeFirstLetter(faker.company.bs()),
            total_attendee_count,
            start_at: new Date(center_time.getTime() - (1000 * 60 * 60 * faker.datatype.number(3))),
            end_at: new Date(center_time.getTime() + (1000 * 60 * 60 * faker.datatype.number(3))),
            details_url: faker.internet.url(),
            extra_details: faker.lorem.paragraph(),
            position: i,
            subtitle: faker.lorem.sentence(),
            subtitle_url: faker.internet.url(),
        })
    }
    return eventlets as [Eventlet, ...Eventlet[]];
}

function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  