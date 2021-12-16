<script lang="ts">
	import { chosenEvent, chosenEventID } from '$lib/store';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	if (get(chosenEvent) === null && browser) {
		goto('/');
	}
</script>

<slot />
