import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	const { eventID } = params;

	return {
		eventID: parseInt(eventID) || null
	}
}
