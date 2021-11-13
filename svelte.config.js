import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import preprocess from 'svelte-preprocess';

const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/src/lib/styles/`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			prependData: `@import '${sassPath}vars.scss';`
		}
	}),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;
