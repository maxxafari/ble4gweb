<script lang="ts">
	import { device } from '$lib/device';
	import { onMount } from 'svelte';

	let BLEConnected = false;

	async function connectToBLE() {
		const con = await device.connect();
		BLEConnected = con;
	}

	onMount(() => {
		const interval = setInterval(() => {
			BLEConnected = device.isConnected();
		}, 500);
		return () => clearInterval(interval);
	});
</script>

<div class="ble">
	<span>Bluetooth vehicle</span>
	{#if BLEConnected}
		<span> 🟢 Connected</span>
	{:else}
		<button on:click={() => connectToBLE()}>Connect Vehicle</button>
	{/if}
</div>

<style>
	.ble {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	button {
		height: 1fr;
	}
</style>
