<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { StageState, type AttendeeProfile } from '../stepManager';

	export let attendeeProfile: Writable<AttendeeProfile>;
	export const stageState = StageState.Complete;

</script>

<div class="select-container">
	<h2>Comfirm Checkin</h2>
</div>

<style lang="scss">
	.select-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		h2 {
			font-size: 2rem;
			margin: 1rem;
		}
	}
</style>
