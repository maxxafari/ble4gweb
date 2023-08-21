<script lang="ts">
	/// <reference types="web-bluetooth" />
	const serviceUUID = 'a3941db0-a97c-4cf1-943f-a25ff9ba40cd';
	const ledCharacteristicUUID = '5b8c0ab6-a058-4684-b2b6-4a0a692e2d45';

	async function getVal(gc: BluetoothRemoteGATTCharacteristic) {
		const dataView = await gc.readValue();
		const valueArray = new Uint8Array(dataView.buffer); // The Uint8Array typed array represents an array of 8-bit unsigned integers.
		console.log('valueArray', valueArray);

		// is there a simpler way to cast this to a number array?
		return [valueArray[0], valueArray[1]];
	}

	let bleDevice: BluetoothDevice | undefined;
	let connected = false;
	let bleServer: BluetoothRemoteGATTServer | undefined;
	let ledService: BluetoothRemoteGATTService | undefined;
	let ledCharacteristic: BluetoothRemoteGATTCharacteristic | undefined;

	let ledValue: number[];

	// reactive
	$: connected = !!bleDevice;

	async function connectToBLE() {
		bleDevice = await navigator.bluetooth.requestDevice({
			filters: [{ namePrefix: 'nrf52' }],
			optionalServices: [serviceUUID]
		});
		if (!bleDevice.gatt) throw new Error('No GATT server');

		bleServer = await bleDevice.gatt?.connect();
		if (!bleServer) throw new Error('No GATT server');
		ledService = await bleServer?.getPrimaryService(serviceUUID);
		if (!ledService) throw new Error('No LED service');
		ledCharacteristic = await ledService.getCharacteristic(ledCharacteristicUUID);
		if (!ledCharacteristic) throw new Error('No LED characteristic');
		console.log('found ledCharacteristic', ledCharacteristic);

		ledValue = await getVal(ledCharacteristic);
	}
	async function disconnectBLE() {
		await bleDevice?.gatt?.disconnect();
		bleDevice = undefined;
	}

	async function getLed() {
		if (!ledCharacteristic) return;
		ledValue = await getVal(ledCharacteristic);
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
		<li><button on:click={() => getLed()}> update</button></li>
		<li>Led: {ledValue}</li>
	</ul>
	<button on:click={() => ledCharacteristic?.writeValue(new Uint8Array([0, 0]))}> Off </button>
	<button on:click={() => ledCharacteristic?.writeValue(new Uint8Array([1, 1]))}> On </button>
</section>

<style>
</style>
