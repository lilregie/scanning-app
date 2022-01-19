<script lang="ts">
	import { chosenEvent } from '$lib/store';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	import { basePath } from '$lib/consts';
	if (get(chosenEvent) === null && browser) {
		goto(`${basePath}/`);
	}
</script>

<slot />
