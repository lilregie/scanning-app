<script lang="ts">
	import { draw, fade } from 'svelte/transition';

	export let colour = '#ffffff';
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 94 94"
	style={`color: ${colour};stroke: ${colour}`}
>
	<g opacity="1">
		<circle
			in:fade|local={{ duration: 350, delay: 250 }}
			style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.3rem;"
			cx="47"
			cy="47"
			r="44.5"
		/>
		<path
			in:draw|local={{ duration: 500, delay: 100 }}
			style="fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.3rem;"
			d="M24 49L38 63L71.5 30"
		/>
	</g>
</svg>
