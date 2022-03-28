<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Button from '$lib/components/Button.svelte';

	export let stageCompleted: boolean;

	const dispatch = createEventDispatcher();

	function skip() {
		dispatch('skip');
	}
	function next() {
		dispatch('next');
	}
    function back() {
        dispatch('back');
    }
</script>

<div class="container">
	<div class="page-focus">
		<slot />
	</div>
	<div class="action-bar">
        <div>
            <Button on:click={back} color="secondary" outline size="large">Back</Button>
		</div>
		<div>
			{#if stageCompleted}
				<Button on:click={next} size="large">Next</Button>
			{:else}
				<Button color="secondary" on:click={skip} size="large">Skip</Button>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
    @use '../../styles/vars.scss' as *;

	.container {
        height: 100%;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;

        $action-bar-height: 5em;
        box-sizing: border-box;
		.action-bar {
            width: 80%;
			position: absolute;
			bottom: 0;
			display: flex;
			align-items: center;
            justify-content: space-between;
		}
        .page-focus {
            width: 80%;
            height: calc(100% - $action-bar-height);
            $border-thickness: 4px;

            border-bottom: $border-light solid $border-thickness;
            border-radius: $border-thickness * 2;
            overflow-y: auto;
            position: relative;
        }
	}
</style>
