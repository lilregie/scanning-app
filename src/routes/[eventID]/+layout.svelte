<script lang="ts">
	import type { LayoutData } from './$types'

	import { currentEventID } from '$lib/store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { basePath } from '$lib/consts';

	export let data: LayoutData;

	let eventID: number | null;

	$: eventID = data.eventID;
	$: currentEventID.set(eventID);

	currentEventID.subscribe(() => {
		if ($currentEventID === null && browser) {
			goto(`${basePath}/eventNotFound`);
		}
	});
</script>

<slot />
