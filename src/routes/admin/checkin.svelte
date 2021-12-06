<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import Scanner from '$lib/components/Scanner.svelte';
</script>

<AdminLayout cardOptionsLeft={{ scroll: false }}>
	<div slot="left-bar">
		<div class="scanner-container">
			<Scanner />
		</div>
	</div>
	<div slot="info-panel">info-panel</div>
	<div slot="list-panel">right-bar</div>
</AdminLayout>

<style lang="scss">
	.scanner-container {
		width: calc(100% + 4rem);
		height: calc(100% + 4rem);
		position: relative;
		left: -2rem;
		top: -2rem;
	}
</style>
