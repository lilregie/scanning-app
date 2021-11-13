<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	export let peopleList: Attendee[] = [];
</script>

{#each peopleList as person}
	<div>
		{person.first_name}
	</div>
{/each}
