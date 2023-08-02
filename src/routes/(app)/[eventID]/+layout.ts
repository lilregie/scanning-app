import type { LayoutLoad } from './$types';
import { basePath } from "$lib/consts";

export const load = (({ fetch, params }) => {
	const eventID = parseInt(params.eventID) || null;

	return {
		event: fetch(`${basePath}/${eventID}`, {
			headers: {
				"Accept": "application/json"
			}
		}).then(resp => resp.json())
	}
}) satisfies LayoutLoad;
