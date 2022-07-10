import { sveltekit } from '@sveltejs/kit/vite';
import svg from '@poppanator/sveltekit-svg';


/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sveltekit(), svg({
        type: 'url'
    })],
    optimizeDeps: {
        include: [
            "events",
            "uuid",
            "visibilityjs",
            "stampit",
            "lodash",
            "dayjs"
        ]
    }
};

export default config;