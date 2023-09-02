<script lang="ts">
	import { createBLEService, createBleDevice } from '$lib/BLEServiceBuilder';
	import { device } from '$lib/device';

	let bleDevice: BluetoothDevice | undefined;
	let connected = false;

	let ledValue: string;
	let batteryLevel: string;
	let degrees = 90;
	// reactive
	$: connected = !!bleDevice;

	async function connectToBLE() {
		await device.connect();
		// wrap this ?
		device.battery.onNotification((value) => {
			console.log('battery value', value);
			batteryLevel = value;
		});

		// this does not work ..
		// needs to be awaited some how...
		// ledValue = await leds.getVal();
	}
	async function disconnectBLE() {
		await device.disconnect();
	}

	async function getLed() {
		ledValue = await device.leds.getVal();
	}
	async function setLed(str: string) {
		await device.leds.setVal(str);
		getLed();
	}
	$: {
		device.servo.setVal(degrees);
	}
</script>

<svelte:head>
	<title>Control</title>
	<meta name="description" content="Control app" />
</svelte:head>

<section>
	{#if !connected}
		<button on:click={() => connectToBLE()}>Connect To Ble</button>
	{:else}
		<button on:click={() => disconnectBLE()}>Disconnect</button>
	{/if}

	<ul>
		<li>Led: {ledValue}</li>
		<li>Battery: {batteryLevel}</li>
		<li><button on:click={() => device.servo?.setVal(90)}>servo</button></li>
		<li><button on:click={() => setLed('00')}>00</button></li>
		<li><input type="range" min="0" max="180" class="slider" bind:value={degrees} /></li>
		<li><button on:click={() => setLed('11')}>11</button></li>
	</ul>
</section>

<style>
</style>
