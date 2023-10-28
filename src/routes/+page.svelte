<script lang="ts">
	import ControlWithStore from '$lib/components/control/ControlWithStore.svelte';
	import Status from '$lib/components/Status.svelte';
	import { device } from '$lib/device';
	import { bindStearingToBle } from '$lib/transferToBle';

	// BLE stuff
	let BLEConnected = false;
	let useVideo = true;
	let wakeLock: WakeLockSentinel | null = null;

	async function connectToBLE() {
		const con = await device.connect();
		BLEConnected = con;
	}
	bindStearingToBle();
</script>

<svelte:head>
	<title>TEST BLE</title>
</svelte:head>
<div>
	<div>
		<p>BLE device</p>
		{#if device.isConnected()}
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
