import type { LayoutLoad } from './$types';
import { basePath } from "$lib/consts";

export const load = (({ fetch, params }) => {
	return {
		event: fetch(`${basePath}/${params.eventID}`, {
			headers: {
				"Accept": "application/json"
			}
		}).then(resp => resp.json())
	}
}) satisfies LayoutLoad;
