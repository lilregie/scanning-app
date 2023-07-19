<script lang="ts">
	import { apiTimers, errorAPICallbacks } from '$lib/api/statusStores';
	import { apiWarnLongTimeMS } from '$lib/consts';

	import { onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';

	import NoInternet from './noInternet.svelte';
	import RequestFail from './requestFail.svelte';
	import RequestTimeOut from './requestTimeOut.svelte';

	enum ConnectionState {
		RequestTimeOut,
		RequestFailed,
		NoInternet,
		Connected
	}

	let connectionState: ConnectionState = ConnectionState.Connected
	let intervalController: NodeJS.Timer

	function checkConnection() {
		// Error Pecking Order:
		// 1. No Internet
		// 2. Request Failed
		// 3. Request Timeout

		if (typeof navigator.onLine === "boolean" && !navigator.onLine) {
			connectionState = ConnectionState.NoInternet;
			return;
		}

		if (get(errorAPICallbacks).length > 0) {
			connectionState = ConnectionState.RequestFailed;
			return;
		}

		get(apiTimers).forEach((_timer)=>{
			if (new Date().getTime() - _timer > apiWarnLongTimeMS) {
				connectionState = ConnectionState.RequestTimeOut;
				return;
			}
		});

		connectionState = ConnectionState.Connected;
	}

	onMount(() => {
		intervalController = setInterval(checkConnection,500)
	})

	onDestroy(() => {
		if (intervalController) {
			clearInterval(intervalController)
		}
	})
</script>

{#if connectionState == ConnectionState.RequestTimeOut}
	<RequestTimeOut />
{:else if connectionState == ConnectionState.RequestFailed}
	<RequestFail />
{:else if connectionState == ConnectionState.NoInternet}
	<NoInternet />
{/if}
