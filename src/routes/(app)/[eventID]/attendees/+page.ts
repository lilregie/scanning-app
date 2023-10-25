import type { PageLoad } from './$types'

export const load = (({ fetch, url }) => {
	return {
		streamed: {
			attendees: fetch(url, {
				headers: {
					"Accept": "application/json"
				}
			}).then(resp => resp.json())
		}
	}
}) satisfies PageLoad;
