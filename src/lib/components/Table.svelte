<script lang="ts" context="module">
	export interface TableRow {
		data: string[];
		hightlighted?: boolean;
		callback?: () => void;
	}
</script>

<script lang="ts">
	export let tableData: TableRow[];
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
		{#each tableData as tableRow}
			<tr on:click={tableRow.callback} class={`${tableRow.callback ? "clickable-row" : ""} ${tableRow.hightlighted ? "highlight" : ""}`}>
				{#each tableRow.data as element}
					<td>{element}</td>
				{/each}
			</tr>

		{/each}
	</tbody>
</table>

<style lang="scss">
	@use 'sass:color';
	@use 'sass:map';
	@use '../styles/vars.scss' as *;
	table {
		$border-weight: 1px;

		text-align: left;
		border-collapse: collapse;
		border: $border-light solid $border-weight;
		width: 100%;
		overflow: auto;


		tbody tr {
			&:hover {
				$hover-adjust: -10%;

				&:nth-child(even) {
					background: color.adjust($background-intermediate-light, $lightness: $hover-adjust);
				}
				&:nth-child(odd) {
					background: color.adjust($background-foreground, $lightness: $hover-adjust);
				}
				&.highlight {
					background: color.adjust(map-get($theme-colors, "primary"), $lightness: $hover-adjust);
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
			&.highlight {
				background: map-get($theme-colors, "primary");
				color: $text-dark;
			}
		}
		thead th {
			font-weight: 600;
			padding: 0.5rem;
			background: $background-foreground;
			position: sticky;
			top: 0;

		}
	}
</style>
