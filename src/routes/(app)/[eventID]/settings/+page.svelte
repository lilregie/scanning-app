<script lang="ts">
	import type { PageData } from "./$types";
	import MetaTitle from "$lib/components/MetaTitle.svelte";

	export let data: PageData;
</script>

{#await data.event then event}
	<MetaTitle parts={ [event.name, "Settings"] } />
{/await}

<h1>Settings</h1>
