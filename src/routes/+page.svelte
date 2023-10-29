<script lang="ts">
	import ControlWithStore from '$lib/components/control/ControlWithStore.svelte';
	import Status from '$lib/components/Status.svelte';
	import { device } from '$lib/device';
	import { bindStearingToBle } from '$lib/transferToBle';
	import { preventScreenLock } from '$lib/utils';
	import { onMount } from 'svelte';

	// BLE stuff
	let BLEConnected = false;
	let useVideo = true;
	let wakeLock: WakeLockSentinel | null = null;

	async function connectToBLE() {
		BLEConnected = await device.connect();
	}

	preventScreenLock();
	bindStearingToBle();
	onMount(() => {
		const interval = setInterval(() => {
			BLEConnected = device.isConnected();
		}, 500);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>TEST BLE</title>
</svelte:head>
<div>
	<div>
		{#if BLEConnected}
			<p>BLE connected</p>
		{:else}
			<button on:click={() => connectToBLE()}>Connect BLE</button>
		{/if}
	</div>
	<Status isSender />
	<ControlWithStore />
</div>

<style>
</style>
