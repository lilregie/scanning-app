
<script lang="ts">
    export let size: 'tiny' | 'small' | 'medium' | 'large' | 'expanded' = 'medium';


    export let searchTerm = "";
	export let placeholder = "";

</script>

<input bind:value={searchTerm} class="{size}" {placeholder}/>

<style lang="scss">
    input {

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
    }
</style>