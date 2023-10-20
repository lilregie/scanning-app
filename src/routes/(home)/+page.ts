import type { PageLoad } from './$types'

export const load = (({ fetch }) => {
	return {
		streamed: {
			events: fetch('/', {
				headers: {
					"Accept": "application/json"
				}
			}).then(resp => resp.json())
		}
	}
}) satisfies PageLoad;
