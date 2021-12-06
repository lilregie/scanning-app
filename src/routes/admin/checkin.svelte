<script lang="ts">
	import AdminLayout from '$lib/components/AdminLayout.svelte';
	import Scanner from '$lib/components/Scanner.svelte';
</script>

<AdminLayout cardOptionsLeft={{ scroll: false }}>
	<div slot="left-bar">
		<Scanner />
	</div>
	<div slot="info-panel">info-panel</div>
	<div slot="list-panel">right-bar</div>
</AdminLayout>
