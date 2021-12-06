import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import svg from '@poppanator/sveltekit-svg';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			// Removed to prefer individual @use in each file
			// https://www.reddit.com/r/sveltejs/comments/pmham1/sveltekit_how_to_set_up_global_scss_accessible_to/hcl8lb6/
			// Also this didn't seem to work in some cases
			// prependData: `@use 'src/lib/styles/vars.scss';`
		}
	}),

	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapter(),
		vite: {
			optimizeDeps: {
				include: ["modern-svelte-qr-scanner","events","uuid","visibilityjs","stampit","lodash"]
			},
			plugins: [svg({
				type: 'url'
			})]
		}
	}
};

export default config;
