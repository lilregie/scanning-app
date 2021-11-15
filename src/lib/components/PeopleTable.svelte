<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	export let peopleList: Attendee[] = [];
</script>
<table>
	<tr>
		<th>Name</th>
		<th>ID</th>
	</tr>
	{#each peopleList as person}
		<tr>
			<th>{person.first_name} {person.last_name}</th>
			<th>{person.id}</th>
		</tr>
	{/each}
</table>

<style lang="scss">
	@use '../styles/vars.scss' as *;
	table {
		background-color: $background-intermediate-light;
	}
</style>