export const load: import('@sveltejs/kit').PageLoad = async ({ url }) => ({
	url: url.pathname
})
