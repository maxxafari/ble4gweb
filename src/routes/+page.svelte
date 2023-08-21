<script lang="ts">
	/// <reference types="web-bluetooth" />
	const serviceUUID = 'a3941db0-a97c-4cf1-943f-a25ff9ba40cd';
	const ledCharacteristicUUID = '5b8c0ab6-a058-4684-b2b6-4a0a692e2d45';

	let bleDevice: BluetoothDevice;
	let bleServer: BluetoothRemoteGATTServer;
	let ledService: BluetoothRemoteGATTService;
	let ledCharacteristic: BluetoothRemoteGATTCharacteristic;

	async function connectToBLE() {
		bleDevice = await navigator.bluetooth.requestDevice({
			filters: [{ namePrefix: 'nrf52' }],
			optionalServices: [serviceUUID]
		});
		if (!bleDevice.gatt) throw new Error('No GATT server');

		bleServer = await bleDevice.gatt?.connect();
		ledService = await bleServer?.getPrimaryService(serviceUUID);
		ledCharacteristic = await ledService.getCharacteristic(ledCharacteristicUUID);
	}
</script>

<svelte:head>
	<title>Control</title>
	<meta name="description" content="Control app" />
	<ul>
		<li>Led: {ledCharacteristic.readValue()}</li>
	</ul>
</svelte:head>

<section>
	<button on:click={() => connectToBLE()}>Connect To Ble</button>
</section>

<style>
</style>
