<script lang="ts">
	export let tableData: string[][];
	export let tableHeaders: string[];
	console.log(tableData);
</script>

<table>
	<thead>
		<tr>
			{#each tableHeaders as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each tableData as row}
			<tr>
				{#each row as element}
					<td>{element}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
	@use 'sass:color';
	@use '../styles/vars.scss' as *;
	table {
		$border-weight: 1px;

		text-align: left;
		border-collapse: collapse;
		border: $border-light solid $border-weight;
		width: 100%;

		tbody tr {
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
