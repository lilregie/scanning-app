<script lang="ts">
	import { currentEvent, stepManagerSettings } from '$lib/store';
	import Switch from '../Switch.svelte';
	export let theme: 'light' | 'dark' = 'light';
</script>

{#if $currentEvent && stepManagerSettings}
	<table class={theme}>
		<tr class="switch-row">
			<td class="label" class:active={$stepManagerSettings.scanTicket}>Check Tickets</td>
			<td><Switch onColour="primary" bind:checked={$stepManagerSettings.scanTicket} /></td>
		</tr>

		{#if $currentEvent?.vaccine_pass_required}
			<tr class="switch-row">
				<td class="label" class:active={$stepManagerSettings.scanVaccinePass}
					>Check Vaccine Passes</td
				>
				<td><Switch onColour="primary" bind:checked={$stepManagerSettings.scanVaccinePass} /></td>
			</tr>
		{/if}
	</table>
{/if}

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	table {
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
		tr {
			td {
				padding: 0.25rem;
				&.label {
					transition: color 150ms ease-in-out;
					font-weight: bold;
					opacity: 0.5;
					&.active {
						opacity: 1;
					}
					transition: opacity 150ms ease-in-out;
				}

				&:not(.label) {
					display: flex;
					justify-content: right;
				}
			}
		}
		&.light tr {
			border-top: $border-light 1px solid;
			border-bottom: $border-light 1px solid;
			td.label {
				color: $text-light;
			}
		}
		&.dark tr {
			border-top: $background-intermediate-dark 2px solid;
			border-bottom: $background-intermediate-dark 2
			px solid;
			
			td.label {
				color: $text-dark;
			}
		}
	}
</style>
