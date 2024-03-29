<script lang="ts" context="module">
	export interface TableRow {
		data: (string | boolean)[];
		hightlighted?: boolean;
		callback?: () => void;
	}
</script>

<script lang="ts">
	import InvalidCross from '$lib/components/InvalidCross.svelte';
	import SuccessTick from '$lib/components/SuccessTick.svelte';

	export let tableData: TableRow[];
	export let tableHeaders: string[];
	export let emptyTableMessage: string = 'Nothing to show...';
	export let tableColumnLine: boolean = false;

	// Used so that the rows can be selected by arrow keys or
	let currentlyClicked = 0;

	let tableBody: HTMLTableSectionElement;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			if (event.key === 'ArrowUp') {
				currentlyClicked--;
			} else {
				currentlyClicked++;
			}
			// constrain to the table
			currentlyClicked = Math.min(Math.max(currentlyClicked, 0), tableData.length - 1);

			let rowCallback = tableData[currentlyClicked].callback;

			if (rowCallback) {
				rowCallback();
			}

			// Make sure the focus updates
			let possibleElements = tableBody.querySelectorAll(`[data-row-id='${currentlyClicked}']`);
			if (possibleElements.length === 1) {
				(possibleElements[0] as HTMLElement).focus();
			} else {
				console.log('incorrect possible elements', possibleElements);
			}
		} else if (event.key === 'Enter') {
			// Use data attribute to get the id of the element
			// and check that that's valid
			let selectedID = parseInt(document.activeElement?.getAttribute('data-row-id') || "");

			if (selectedID >= 0 && selectedID < tableData.length) {
				currentlyClicked = selectedID;

				let rowCallback = tableData[currentlyClicked].callback;
				if (rowCallback) {
					rowCallback();
				}
			}
		}
	}

	function callbackWrapper(id: number, callback: () => void): () => void {
		return () => {
			currentlyClicked = id;
			callback();
		};
	}
</script>

<div class="table-wrapper">
	<table on:keydown={handleKeydown} class:tableColumnLine>
		<thead>
			<tr>
				{#each tableHeaders as header}
					<th>{header}</th>
				{/each}
			</tr>
		</thead>
		<tbody bind:this={tableBody}>
			{#each Array.from(tableData.entries()) as [id, tableRow]}
				<!-- tabindex="0" is required to make the table tabbable -->
				<!-- data-row-id={id} is required to let the Enter key go from the currently selected element from the event to the row ID -->
				<tr
					on:click={callbackWrapper(id, tableRow.callback)}
					class={`${tableRow.callback ? 'clickable-row' : ''} ${
						tableRow.hightlighted ? 'highlight' : ''
					}`}
					tabindex="0"
					data-row-id={id}
				>
					{#each tableRow.data as element}
						<td>
							{#if typeof element === 'string'}
								{element}
							{:else if typeof element === 'boolean'}
								{#if element}
									<SuccessTick colour={tableRow.hightlighted ? '#fff' : '#2ba628'} />
								{:else}
									<InvalidCross colour={tableRow.hightlighted ? '#fff' : '#d0021b'} />
								{/if}
							{:else if typeof element === 'number'}
								{`#${element}`}
							{:else}
								<code>{JSON.stringify(element)}</code>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	{#if tableData.length === 0}
		<div class="no-data-info">
			{emptyTableMessage}
		</div>
	{/if}
</div>

<style lang="scss">
	@use 'sass:color';
	@use 'sass:map';
	@use '../styles/vars.scss' as *;

	.table-wrapper {
		background: rgba($background-foreground, 0.9);
	}
	
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
					background: color.adjust(map-get($theme-colors, 'primary'), $lightness: $hover-adjust);
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
				:global(svg) {
					width: 1.25rem;
					display: inline;
					vertical-align: bottom;
				}
			}
			&.clickable-row {
				cursor: pointer;
			}
			&.highlight {
				background: map-get($theme-colors, 'primary');
				color: $text-dark;
			}
		}
		thead {
			position: sticky;
			top: 0;

			th {
				font-weight: 600;
				padding: 0.5rem;
				background: rgba($background-foreground, 0.9);
			}
		}
		&.tableColumnLine {
			td, th {
				border-left: $border-light solid $border-weight;
			}
			thead {
				border-bottom: $border-light solid calc($border-weight * 2);
			}
		}
	}
	.no-data-info {
		padding: 1rem;
		text-align: center;
		font-size: 1.25rem;
		font-weight: bold;
		opacity: 0.5;
	}
</style>
