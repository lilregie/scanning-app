import type { PageLoad } from './$types'

export const load = (({ fetch }) => {
	return {
		events: fetch('/', {
			headers: {
				"Accept": "application/json"
			}
		}).then(resp => resp.json())
	}
}) satisfies PageLoad;
