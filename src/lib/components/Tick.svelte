<script lang="ts">
	import { draw, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let visible = true;
</script>

{#if visible}
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 94">
		<g out:fade={{ duration: 200 }} opacity="1">
			<circle
				in:fade={{ duration: 350, delay: 250 }}
				style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.3rem;"
				cx="47"
				cy="47"
				r="44.5"
			/>
			<path
				in:draw={{ duration: 500, delay: 100 }}
				style="fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:0.3rem;"
				d="M24 49L38 63L71.5 30"
			/>
		</g>
	</svg>
{/if}

<style lang="scss">
</style>
