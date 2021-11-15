<script lang="ts">
	import type { Attendee } from '$lib/attendee';
	export let peopleList: Attendee[] = [];
</script>

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>ID</th>
		</tr>
	</thead>
	{#each peopleList as person}
	<tbody>
		<tr>
			<td>{person.first_name} {person.last_name}</td>
			<td>#{person.id}</td>
		</tr>
	</tbody>
	{/each}
</table>

<style lang="scss">
	@use "sass:color";
	@use '../styles/vars.scss' as *;
	table {
		$border-weight: 1px;

		text-align: left;
		border-collapse: collapse;
		border: $border-light solid $border-weight;

		tbody {
			&:hover {
				$hover-adjust: -10%;
				
				&:nth-child(even) {
					background: color.adjust($background-intermediate-light, $lightness: $hover-adjust);
				}
				&:nth-child(odd) {
					background: color.adjust($background-foreground, $lightness: $hover-adjust);
				}
			}
			&:nth-child(even) {
				background: $background-intermediate-light;
			}
			&:nth-child(odd) {
				background: $background-foreground;
			}

			td {
				border-top: $border-light solid $border-weight;
				padding: 0.5rem;
			}
		}
		thead th {
				font-weight: 600;
				padding: 0.5rem;
		}


	}
</style>
