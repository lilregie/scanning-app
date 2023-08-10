<script lang="ts">
	import CloseButton from "./CloseButton.svelte";

	export let expand: boolean = false;
	export let margin: boolean = true;
	export let scroll: boolean = true;
	export let shadow: false | 'small' | 'medium' | 'large' = 'medium';
	export let background: boolean | string = true;
	export let allowClosing: boolean = false;
</script>

<div
	class="card shadow-{shadow}"
	class:expand
	class:margin
	class:scroll
	class:transparent={!background}
	class:has-footer={$$slots.footer}
>
	{#if allowClosing}
		<CloseButton on:close/>
	{/if}
	<div class="contents">
		<slot />
	</div>
	{#if $$slots.footer}
		<div class="footer">
			<div class="f-underlay" />
			<div class="f-contents">
				<slot name="footer" />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	.card {
		background: $background-foreground;
		color: $text-light;
		border-radius: $radius-default;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;

		&.transparent {
			background: none;
			color: $text-dark;
		}

		@each $size, $shadow in $shadows {
			&.shadow-#{$size} {
				box-shadow: $shadow;
			}
		}

		&.margin {
			--base-margin: 2rem;
			.contents {
				margin: var(--base-margin);
				position: relative;
			}
			&.has-footer .contents {
				margin-bottom: 0;
				padding-bottom: var(--base-margin);
			}
			.footer {
				padding: var(--base-margin);
				margin-top: calc( var(--base-margin) * -1);
			}
			@media screen and (max-width: $breakpoint-mobile) {
				--base-margin: 1rem;
			}
		}

		.footer {
			// Footer only shows if slot is filled
			position: relative;
			background: linear-gradient(to bottom, #fff0 0rem, #fff 2rem);

			.f-contents {
				z-index: 2;
				position: relative;
			}

			.f-underlay {
				content: ' ';
				position: absolute;
				bottom: 0;
				left: 0;
				height: 100%;
				width: 100%;
				z-index: 1;
			}
		}

		&.expand {
			flex: 1;
			height: 100%;

			.contents {
				flex-grow: 1;
			}

			&.scroll .contents {
				overflow: auto;
			}
		}
	}
</style>
