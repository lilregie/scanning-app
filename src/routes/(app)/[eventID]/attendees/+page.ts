import type { PageLoad } from './$types'

export const load = (({ fetch, url }) => {
	return {
		attendees: fetch(url, {
			headers: {
				"Accept": "application/json"
			}
		}).then(resp => resp.json())
	}
}) satisfies PageLoad;
