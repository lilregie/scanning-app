export const load: import('@sveltejs/kit').PageLoad = ({ url }) => {
	return {
		eventID: parseInt(url.searchParams.get('eventID')) || null
	};
}
