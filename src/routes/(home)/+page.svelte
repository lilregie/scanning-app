<script lang="ts">
	import MetaTitle from '$lib/components/MetaTitle.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MetaTitle parts={ ["Home"] } />

<main class="container m-auto">
	{#await data.events}
		<h1>Loading event data</h1>
	{:then value}
		<h1>Choose your event</h1>

		<ol class="event-list">
			{#each value as event (event.id)}
				<li>
					<a href="/checkin/events/{event.id}" class="card event-link">
						<span class="label-container">
							<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="dashboard-icon">
								<path d="M12.4531 0.5C12.9219 0.5 13.2969 0.78125 13.4844 1.15625L16.7188 7.76562L23.8906 8.84375C24.3125 8.89062 24.6406 9.21875 24.7812 9.59375C24.9219 10.0156 24.8281 10.4375 24.5 10.7656L19.2969 15.9219L20.5156 23.1875C20.6094 23.6094 20.4219 24.0781 20.0938 24.3125C19.7188 24.5469 19.25 24.5938 18.875 24.4062L12.4531 20.9375L6.03125 24.4062C5.65625 24.5938 5.23438 24.5469 4.85938 24.3125C4.53125 24.0781 4.34375 23.6094 4.39062 23.1875L5.65625 15.9219L0.453125 10.7656C0.125 10.4375 0.03125 10.0156 0.171875 9.59375C0.3125 9.21875 0.640625 8.89062 1.0625 8.84375L8.23438 7.76562L11.4688 1.15625C11.6562 0.78125 12.0312 0.5 12.4531 0.5ZM12.4531 4.20312L10.0156 9.3125C9.82812 9.64062 9.54688 9.875 9.17188 9.92188L3.59375 10.7188L7.625 14.7031C7.90625 14.9844 8 15.3594 7.95312 15.7344L7.01562 21.3125L11.9375 18.6875C12.2656 18.5 12.6875 18.5 13.0156 18.6875L17.9375 21.3125L17 15.7344C16.9062 15.3594 17.0469 14.9844 17.3281 14.7031L21.3125 10.7188L15.7812 9.92188C15.4062 9.875 15.0781 9.64062 14.9375 9.3125L12.4531 4.20312Z" fill="black"/>
							</svg>
							<span class="label">{event.name}</span>
						</span>
						<svg class="flex-shrink-0" width="10" height="15" viewBox="0 0 10 15" xmlns="http://www.w3.org/2000/svg">
							<path d="M2 14.5C1.71875 14.5 1.46875 14.4062 1.28125 14.2188C0.875 13.8438 0.875 13.1875 1.28125 12.8125L6.5625 7.5L1.28125 2.21875C0.875 1.84375 0.875 1.1875 1.28125 0.8125C1.65625 0.40625 2.3125 0.40625 2.6875 0.8125L8.6875 6.8125C9.09375 7.1875 9.09375 7.84375 8.6875 8.21875L2.6875 14.2188C2.5 14.4062 2.25 14.5 2 14.5Z" fill="#ABB2B0"/>
						</svg>
					</a>
				</li>
			{/each}
		</ol>
	{/await}
</main>

<style lang="scss">
	@use '../../lib/styles/vars.scss' as *;

	.container {
		color: #CF2265;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100dvh;
		padding: 1em;
	}

	.event-list {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.event-link {
		gap: 1rem;
		text-decoration: none;
	}

	.label {
		font: {
			feature-settings: 'clig' off, 'liga' off;
			size: 16px;
			style: normal;
			weight: 700;
		}
	}

	.label-container {
		display: flex;
		gap: 0.75em;
		align-items: center;
	}

	.dashboard-icon {
		flex-shrink: 0;
	}
</style>
