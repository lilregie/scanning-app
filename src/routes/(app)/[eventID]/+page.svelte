<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import type { LilRegieEvent, Eventlet } from '$lib/event';

	import { Circle } from 'svelte-loading-spinners';
	import CheckinChart from '$lib/components/CheckinChart.svelte';
	import StatsView from '$lib/components/StatsView.svelte';
	import MetaTitle from '$lib/components/MetaTitle.svelte';
	import { byNameRank } from '$lib/utill';
	import { afterNavigate, invalidate } from '$app/navigation';

	export let data: PageData;

	function eventChartLabels(event: LilRegieEvent): string[] {
		return [
			"Checked in",
			"Not Checked in"
		]
	}

	function eventStats(stats: number[], eventlet: Eventlet): number[] {
		return [
			(stats[0] ?? 0) + eventlet.checked_in_count,
			(stats[1] ?? 0) + eventlet.confirmed_attending_count - eventlet.checked_in_count
		]
	}

	function eventChartData(event: LilRegieEvent): number[] {
		return event.eventlets.reduce(eventStats, [])
	}

	function eventletChartData(eventlet: Eventlet): number[] {
		return [
			eventlet.checked_in_count,
			eventlet.confirmed_attending_count - eventlet.checked_in_count
		]
	}

	afterNavigate((navigationEvent) => {
		const { from, to, type } = navigationEvent
		if (type === "enter" || to === null || from === null) return;

		const currentRouteId = $page.route.id
		// no need to reload on initial load but do so on subsequent page navigation
		if (from.route.id !== null && from.route.id !== currentRouteId && to.route.id === currentRouteId) {
			invalidate("app:eventlets")
		}
	})

</script>

{#await data.event}
	<p>Loading event details</p>
	<div class="loading-spinner">
		<Circle color="grey" size="5" unit="em" />
	</div>
{:then event}
	<MetaTitle parts={ [event.name, "Dashboard"] } />
	<h1 class="leading-tight">{ event.name }</h1>
	<small class="block text-base text-center mb-4">{ event.date_interval }</small>

	<div class="latest-check-ins-container">
		<StatsView labels={ eventChartLabels(event) } data={ eventChartData(event) }/>
	</div>

	{#if !event.standalone}
		<section class="space-y-2">
			<h2 class="section-heading">
				<svg width="25" height="17" viewBox="0 0 25 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.5 5.5C5.5 4.76953 6.10156 4.125 6.875 4.125H17.875C18.6055 4.125 19.25 4.76953 19.25 5.5V11C19.25 11.7734 18.6055 12.375 17.875 12.375H6.875C6.10156 12.375 5.5 11.7734 5.5 11V5.5ZM17.1875 6.1875H7.5625V10.3125H17.1875V6.1875ZM24.75 2.75V6.1875C23.5898 6.1875 22.6875 7.13281 22.6875 8.25C22.6875 9.41016 23.5898 10.3125 24.75 10.3125V13.75C24.75 15.2969 23.5039 16.5 22 16.5H2.75C1.20312 16.5 0 15.2969 0 13.75V10.3125C1.11719 10.3125 2.0625 9.41016 2.0625 8.25C2.0625 7.13281 1.11719 6.1875 0 6.1875V2.75C0 1.24609 1.20312 0 2.75 0H22C23.5039 0 24.75 1.24609 24.75 2.75ZM2.0625 4.68359C3.26562 5.41406 4.125 6.74609 4.125 8.25C4.125 9.79688 3.26562 11.1289 2.0625 11.8594V13.75C2.0625 14.1367 2.36328 14.4375 2.75 14.4375H22C22.3438 14.4375 22.6875 14.1367 22.6875 13.75V11.8594C21.4414 11.1289 20.625 9.79688 20.625 8.25C20.625 6.74609 21.4414 5.41406 22.6875 4.68359V2.75C22.6875 2.40625 22.3438 2.0625 22 2.0625H2.75C2.36328 2.0625 2.0625 2.40625 2.0625 2.75V4.68359Z" />
				</svg>
				<span>Check-in by Eventlet</span>
			</h2>
			<ol class="eventlet-tiles space-y-2">
				{#each event.eventlets.sort(byNameRank) as eventlet (eventlet.id)}
					<li>
						<a href="/checkin/events/{$page.params.eventID}/edit?eventlet={eventlet.id}" class="card eventlet-tile">
							<div class="space-y-2">
								<h3 class="eventlet-name">{ eventlet.name }</h3>
								<div class="eventlet-stats-container">
									<div class="chart-container">
										<CheckinChart data={ eventletChartData(eventlet) } />
									</div>
									<dl class="eventlet-stats">
										<div class="eventlet-stat isCheckedIn">
											<dt>Checked in</dt>
											<dd>{ eventlet.checked_in_count }</dd>
										</div>
										<div class="eventlet-stat">
											<dt>Not Checked in</dt>
											<dd>{ eventlet.confirmed_attending_count - eventlet.checked_in_count }</dd>
										</div>
									</dl>
								</div>
							</div>
							<svg class="flex-shrink-0" width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M2 15C1.71875 15 1.46875 14.9062 1.28125 14.7188C0.875 14.3438 0.875 13.6875 1.28125 13.3125L6.5625 8L1.28125 2.71875C0.875 2.34375 0.875 1.6875 1.28125 1.3125C1.65625 0.90625 2.3125 0.90625 2.6875 1.3125L8.6875 7.3125C9.09375 7.6875 9.09375 8.34375 8.6875 8.71875L2.6875 14.7188C2.5 14.9062 2.25 15 2 15Z" fill="#ABB2B0"/>
							</svg>
						</a>
					</li>
				{/each}
			</ol>
		</section>
	{/if}
{/await}

<style lang="scss">
	@use '../../../lib/styles/vars.scss' as *;

	h1,
	h2 {
		font-weight: bold;;
		text-align: center;
	}

	.section-heading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.25em;
		font: {
			size: 22px;
		}
	}

	.latest-check-ins-container {
		background-color: #FFFFFF;
		border-radius: 12px;
		border: 1px solid #DFDFDF;
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 1.5rem 1.25rem;
		margin-bottom: 2rem;
	}

	.eventlet-tile {
		padding: 0.8em 1em 0.9em;
	}

	.eventlet-name {
		color: #CF2265;

		font: {
			size: 18px;
			weight: bold;
		}
		line-height: 1.5;
		margin: 0;
	}

	.eventlet-stats-container {
		display: flex;
		gap: 1em;
		align-items: center;
	}

	.eventlet-stats {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
	}

	.eventlet-stat {
		display: flex;
		flex-direction: row-reverse;
		gap: 0.4em;
		justify-content: left;

		&.isCheckedIn {
			color: #3DC393;
		}

		dd {
			font: {
				weight: bold;
			}
			margin: 0;
		}
	}

	.chart-container {
		$size: 50px;

		height: $size;
		width: $size;
		overflow: hidden;
	}

	.loading-spinner {
		display: flex;
		align-self: center;
		align-items: center;
		flex-grow: 1;
		margin: 1em auto;
	}
</style>
