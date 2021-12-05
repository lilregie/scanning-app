import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
import svg from '@poppanator/sveltekit-svg';


const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/src/lib/styles/`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			prependData: `@use '${sassPath}vars.scss' as *;`
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
