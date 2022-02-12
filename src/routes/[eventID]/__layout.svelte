<script lang="ts" context="module">
	export async function load({params}) {
		const {eventID} = params;
		return {
			props: {
				eventID: eventID || null
			}
		}
	}
</script>

<script lang="ts">
	import { chosenEventID } from '$lib/store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { basePath } from '$lib/consts';

	export let eventID: string;

	chosenEventID.set(eventID);
	chosenEventID.subscribe(id => {
		if ($chosenEventID === null && browser) {
			goto(`${basePath}/eventNotFound`);
		}
	});
	
</script>

<slot />
