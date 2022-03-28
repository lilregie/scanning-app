<script lang="ts">
	import SuccessTick from "$lib/components/SuccessTick.svelte";
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime.js';
	import type { NZCovidPass } from "./scanner/validateScan";

	dayjs.extend(relativeTime, { rounding: Math.floor });

	export let data: NZCovidPass;

	$: name = `${data.givenName} ${data.lastName}`.toLowerCase();
</script>
<div class="container">
	<div class="tick-wrapper">
		<SuccessTick colour="green"/>
	</div>
	<div>
		<div class="header" title={`Until ${dayjs(data.covidPassInfo.expires).format("YYYY-MM-DD")}`}>
			COVID Pass Valid
		</div>
		<div class="details">
			<span class="name" title={`${data.givenName} ${data.lastName}`}>{name}</span>
			<br/>
			<span title={`DOB: ${data.DOB}`}>Age: {dayjs(data.DOB).toNow(true)}</span>
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
		.name {
			text-transform: capitalize;
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
