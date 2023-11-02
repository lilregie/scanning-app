import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';
import childProcess from 'node:child_process';

let lastCommitHash = '';
try {
	lastCommitHash = childProcess.execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
	console.error('Could not get git commit hash: ', e);
}

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: "lilregie",
				project: "checkin-app"
			}
		}),
		sveltekit(),
		svg({
			type: 'url'
		})
	],

	optimizeDeps: {
		include: ['events', 'uuid', 'visibilityjs', 'stampit', 'lodash', 'dayjs']
	},

	define: {
		__COMMIT_HASH__: JSON.stringify(lastCommitHash)
	}
};

export default config;
