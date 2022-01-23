<script lang="ts">
	export let expand: boolean = false;
	export let margin: boolean = true;
	export let scroll: boolean = true;
	export let shadow: false | 'small' | 'medium' | 'large' = 'medium';
</script>

<div
	class="card shadow-{shadow}"
	class:expand
	class:margin
	class:scroll
	class:has-footer={$$slots.footer}
>
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

		@each $size, $shadow in $shadows {
			&.shadow-#{$size} {
				box-shadow: $shadow;
			}
		}

		&.margin {
			.contents {
				margin: 2rem;
				position: relative;
			}
			&.has-footer .contents {
				margin-bottom: 0;
				padding-bottom: 2rem;
			}
			.footer {
				padding: 2rem;
				margin-top: -2rem;
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
