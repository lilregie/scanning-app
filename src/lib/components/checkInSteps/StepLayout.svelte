<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade } from "svelte/transition";

	import Button from '$lib/components/Button.svelte';
	import { StageState } from './stepManager';

	export let stageState: StageState;
	export let firstStep: boolean;
	export let lastStep: boolean;

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
	function force() {
		dispatch('force');
	}
	function handleKeypress(event: KeyboardEvent) {
		console.log(event.key)
		if (event.key === "ArrowRight") {
			// Make sure they can go right
			if (!(stageState===StageState.Stay || stageState===StageState.Loading)) {
				next()
			}
		} else if (event.key === "ArrowLeft") {
			back()
		}
	}
</script>
<svelte:window on:keydown={handleKeypress}/>

<div class="container" >
	<div class="page-focus"  in:fade={{duration: 100}} out:fade={{duration: 100}}>
		<slot />
	</div>
	<div class="action-bar">
		<div>
			{#if !firstStep}
				<Button on:click={back} color="secondary" outline size="large">Back</Button>
			{:else}
				<Button color="secondary" outline size="large" disabled>Back</Button>
			{/if}
		</div>
		<div>
			{#if stageState == StageState.Complete}
				<Button on:click={next} size="large">
					{lastStep ? "Finish" : "Next"}
				</Button>
			{:else if stageState == StageState.Warning}
				<Button on:click={force} size="large" color="warning">
					{lastStep ? "Force Finish" : "Force"}
				</Button>
			{:else if stageState == StageState.Incomplete}
				<Button color="secondary" on:click={skip} size="large">
					{lastStep ? "Skip & Finish" : "Skip"}
				</Button>
			{:else if stageState == StageState.Stay}
				<Button
					color="secondary"
					on:click={skip}
					size="large"
					disabled
					title="You cannot continue without at least completing this step">
					{lastStep ? "Skip & Finish" : "Skip"}
				</Button>
			{:else if stageState == StageState.Loading}
				<Button
					color="secondary"
					size="large"
					disabled>
					...
				</Button>
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
