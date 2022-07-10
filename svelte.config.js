import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';

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
		appDir: process.env['RAILS_ENV'] ? '_assets' : '_app',
		adapter: adapter({
			fallback: process.env['RAILS_ENV'] ? 'layouts/checkin.html.erb' : 'index.html'
		}),
		files: {
			template: process.env['RAILS_ENV'] ? 'src/checkin_rails_layout.html' : 'src/app.html'
		},
		paths: {
			base: process.env['ROOT_PATH'] ? process.env['ROOT_PATH'] : '',
			assets: process.env['PUBLIC_ASSETS_PATH'] ? process.env['PUBLIC_ASSETS_PATH'] : ''
		}
	},
};

export default config;
