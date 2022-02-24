<script lang="ts">
	import SuccessTick from "$lib/components/SuccessTick.svelte";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';

	dayjs.extend(relativeTime, { rounding: Math.floor });

	export let name: string;
	export let dob: string;
</script>
<div class="container">
	<div class="tick-wrapper">
		<SuccessTick colour="green"/>
	</div>
	<div>
		<div class="header">
			COVID Pass Valid
		</div>
		<div class="details">
			{name}
			<br/>
			Age: <span title={dob}>{dayjs(dob).toNow(true)}</span>
		</div>
	</div>
</div>
<style lang="scss">
	@use '../styles/vars.scss' as *;
	.container {
		background-color: $background-intermediate-light;
		display: flex;

		& > * {
			margin: 0.5rem 1rem;
		}

		.tick-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;

			:global(svg) {
				height: 40px;
			}
		}
	}

	.header {
		font-size: 1.5rem;
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.header {
			font-size: 1rem;
		}

		.details {
			font-size: 0.8rem;
		}
	}
</style>
