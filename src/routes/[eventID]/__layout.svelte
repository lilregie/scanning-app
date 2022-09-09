<script lang="ts" context="module">
	export const load: import('@sveltejs/kit').Load = async ({params}) => {
		const {eventID} = params;
		return {
			props: {
				eventID: parseInt(eventID) || null
			}
		}
	}
</script>

<script lang="ts">
	import { currentEventID } from '$lib/store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { basePath } from '$lib/consts';

	export let eventID: number;

	currentEventID.set(eventID);
	currentEventID.subscribe(() => {
		if ($currentEventID === null && browser) {
			goto(`${basePath}/eventNotFound`);
		}
	});

</script>

<slot />