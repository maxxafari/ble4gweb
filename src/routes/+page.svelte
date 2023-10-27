<script lang="ts">
	import { peer1Store } from './peer1/peer1.ts';
	import { device } from '$lib/device';

	// BLE stuff
	let BLEConnected = false;
	let useVideo = true;
	let wakeLock: WakeLockSentinel | null = null;

	async function connectToBLE() {
		const con = await device.connect('Feather');
		BLEConnected = con;
	}
</script>

<svelte:head>
	<title>TEST BLE</title>
</svelte:head>
<div>
	<div>
		<p>BLE device</p>
		{#if BLEConnected}
			<p>BLE connected</p>
		{:else}
			<button on:click={() => connectToBLE()}>Connect BLE</button>
		{/if}
	</div>
</div>

<style>
</style>
