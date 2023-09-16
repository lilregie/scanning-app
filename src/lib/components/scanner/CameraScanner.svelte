<script lang="ts">
	import QR from '@lilregie/svelte-scanner';
	import { Circle } from 'svelte-loading-spinners';

	let mediaErrorMessage = '';
</script>

<QR
	on:scan
	bind:mediaErrorMessage
>
	<div slot="loading" class="loading">
		<Circle color="white" />
	</div>
	<div slot="failedToInitialize" class="failedToInitialize">
		<span class="error-header">Failed to start Camera!</span>
		<span class="error-text">{mediaErrorMessage}</span>
	</div>
</QR>

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	.loading,
	.failedToInitialize {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		height: 100%;
		color: $text-dark;
		border-radius: 2px;
	}

	.failedToInitialize {
		.error-header {
			font-size: 1.5rem;
			font-weight: bold;
			margin-bottom: 1rem;
		}

		.error-text {
			font-family: 'Courier New', Courier, monospace;
			background-color: $background-intermediate-dark;
			padding: 0.25rem;
			border-radius: 0.25rem;
			font-size: 1.15rem;
		}
	}
</style>
