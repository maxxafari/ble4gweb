<script lang="ts">
	import { createBLEService, createBleDevice } from '$lib/BLEService';

	let bleDevice: BluetoothDevice | undefined;
	let connected = false;

	let ledValue: number[];
	let batteryLevel: string;
	// reactive
	$: connected = !!bleDevice;

	const battery = createBLEService<string>({
		name: 'Battery',
		serviceId: 'battery_service',
		characteristicId: 'battery_level',
		isNotifiable: true,
		readParser: (dataView) => dataView.getUint8(0).toString()
	});

	const ble = createBleDevice([battery]);

	async function connectToBLE() {
		await ble.connect();
		battery.onNotification((value) => {
			console.log('battery value', value);
			batteryLevel = value;
		});

		//ledValue = await getVal(ledCharacteristic);
	}
	async function disconnectBLE() {
		await ble.disconnect();
	}

	// async function getLed() {
	// 	if (!ledCharacteristic) return;
	// 	ledValue = await getVal(ledCharacteristic);
	// }
	// async function setLed(blue: number, red: number) {
	// 	if (!ledCharacteristic) return;
	// 	await ledCharacteristic.writeValue(new Uint8Array([blue, red]));
	// 	getLed();
	// }
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
	</ul>
</section>

<style>
</style>
