<script lang="ts">
	export let tableData: TableRow[];
	export let tableHeaders: string[];
	console.log(tableData);

	interface TableRow {
		data: string[];
		callback?: () => void;
	}
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
		{#each tableData as tableRow}
			{#if tableRow.callback}
				<tr on:click={tableRow.callback} class="clickable-row">
					{#each tableRow.data as element}
						<td>{element}</td>
					{/each}
				</tr>
			{:else}
				<tr>
					{#each tableRow.data as element}
						<td>{element}</td>
					{/each}
				</tr>
			{/if}

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
			&.clickable-row {
				cursor: pointer;
			}
		}
		thead th {
			font-weight: 600;
			padding: 0.5rem;
		}
	}
</style>
