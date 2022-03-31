<script lang="ts">
	import { currentEvent, selectedEventletIDs } from '$lib/store';
	export let eventletId: number;

	$: eventletSelected = $selectedEventletIDs.includes(eventletId);
	$: eventlet = $currentEvent.eventlets.find((eventlet) => eventlet.id === eventletId);
</script>

<div class="eventlet" alt={`#${eventlet.id}`} class:selected={eventletSelected}>
	<span class="eventlet-name">{eventlet.name}</span>
</div>

<style lang="scss">
    @use '../../styles/vars.scss' as *;

	.eventlet {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		border-radius: 0.25rem;
		background-color: #fff;
		box-shadow: map-get($map: $shadows, $key: 'small');
		&.selected {
			border: map-get($map: $theme-colors, $key: 'primary') solid 2px;
		}
		.eventlet-name {
			font-size: 1.25rem;
			font-weight: bold;
		}
	}
</style>
