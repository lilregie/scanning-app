<script lang="ts">
	export let parts: string[]
</script>

<svelte:head>
	<title>{["Lil Regie", "Ticket Scanner", ...parts].join(' · ')}</title>
</svelte:head>
