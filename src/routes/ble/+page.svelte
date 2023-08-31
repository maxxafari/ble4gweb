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

	const servo = createBLEService<string>({
		name: 'Servo',
		serviceId: '847a27cd-ccf0-4f7e-8cb4-d5fe53df2d60',
		characteristicId: '7c1b818b-dff0-4514-8bcf-f0ad8c79fad9',
		isNotifiable: false,
		readParser: (dataView) => dataView.getUint8(0).toString(),
		setParser: (value: string) => {
			const degrees: number = parseInt(value);
			const bin = degrees.toString(2);
			const buff = new ArrayBuffer([
				bin[0],
				bin[1],
				bin[2],
				bin[3],
				bin[4],
				bin[5],
				bin[6],
				bin[7]
			]);
			return buff;
		}
	});
	const ble = createBleDevice([battery, servo]);

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
		<li><button on:click={() => servo?.setVal('100')}>servo</button></li>
	</ul>
</section>

<style>
</style>
