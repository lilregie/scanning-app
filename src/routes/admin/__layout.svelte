<script lang="ts">
	import { chosenEventID } from '$lib/store';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { browser } from '$app/env';
	if (get(chosenEventID) === -1 && browser) {
		goto('/');
	}
</script>

<slot />
