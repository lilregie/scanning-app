<script lang="ts">
	import type { Person } from '$lib/person';
	export let peopleList: Person[] = [];
</script>
{#each peopleList as person}
<div>
    {person.first_name}
</div>
{/each}
