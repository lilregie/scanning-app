<script lang="ts">
	export let color: 'primary' | 'secondary' | 'success' | 'warning' = 'primary';
	export let href: string | undefined = undefined;
	export let size: 'tiny' | 'small' | 'medium' | 'large' = 'medium';
	export let submit: boolean = true;
	export let disabled: boolean = false;
	export let outline: boolean = false;
	export let expanded: boolean = false;
	export let title: string | null = null;
</script>

{#if href}
	<a on:click class="{ color } { size }" class:outline class:expanded class:disabled { href } { title }>
		<slot>Submit</slot>
	</a>
{:else}
	<button
		on:click
		class="{ color } { size }"
		class:outline
		class:expanded
		type={ submit ? 'submit' : undefined }
		{ disabled }
		{ title }
	>
		<slot>Submit</slot>
	</button>
{/if}

<style lang="scss">
	@use '../styles/vars.scss' as *;

	a,
	button {
		display: inline-block;
		box-sizing: border-box;
		padding: 0.85em 1em;
		margin: 0;
		vertical-align: middle;
		font-size: 1rem;
		border: 1px solid transparent;
		border-radius: 4px;
		background-color: map-get($theme-colors, 'primary');
		color: #fefefe;
		line-height: 1;
		text-align: center;
		cursor: pointer;
		appearance: none;
		text-decoration: none;
		transition: background-color 0.15s ease-out, color 0.25s ease-out;

		&.tiny {
			font-size: 0.8rem;
			padding-top: 0.48rem;
			padding-bottom: 0.48rem;
		}

		&.small {
			font-size: 0.9rem;
			padding-top: 0.54rem;
			padding-bottom: 0.54rem;
		}

		&.large {
			font-size: 1.3rem;
			padding-top: 0.78rem;
			padding-bottom: 0.78rem;
		}

		&.expanded {
			display: block;
			width: 100%;
			margin-left: 0;
			margin-right: 0;
		}

		@each $name, $color in $theme-colors {
			&.#{$name} {
				background-color: $color;
				color: #fefefe;

				&:hover,
				&:focus {
					background-color: darken($color, $amount: 10%);
					color: #fefefe;
				}

				&:active {
					background-color: darken($color, $amount: 20%);
				}
			}
		}

		&.disabled,
		&[disabled] {
			opacity: 0.25;
			cursor: not-allowed;
		}
	}
</style>
