
<script lang="ts">
    export let size: 'tiny' | 'small' | 'medium' | 'large' = 'medium';

    export let textInputValue = "";
	export let placeholder = "";
	export let disabled = false;
	export let expanded: boolean = false;

	export let inputComponent: HTMLInputElement | null = null;
</script>

<input bind:value={textInputValue} class="{size}" class:expanded {placeholder} disabled={disabled} bind:this={inputComponent}/>

<style lang="scss">
	@use '../styles/vars.scss' as *;

    input {
		border: $border-light solid 1px;
		border-radius: 0;
		margin: 1em 0;
		padding: 0.5em 1em;
		box-sizing: border-box;
		font-size: 0.9rem;
		padding-top: 0.54rem;
		padding-bottom: 0.54rem;
		&.tiny {
			font-size: 0.8rem;
			padding-top: 0.2rem;
			padding-bottom: 0.2rem;
		}

		&.small {
			font-size: 0.8rem;
			padding-top: 0.48rem;
			padding-bottom: 0.48rem;
		}

		&.large {
			font-size: 1.3rem;
			padding-top: 0.58rem;
			padding-bottom: 0.58rem;
		}

		&.expanded {
			display: block;
			width: 100%;
			margin-left: 0;
			margin-right: 0;
		}
    }
</style>