<script lang="ts">
	import { device } from '$lib/device';
	import type { PeerStore } from '$lib/peers';
	import { peer1Store } from './peer1';

	// BLE stuff
	let BLEConnected = false;
	let useVideo = false;
	let onCommand = (val: string) => {
		console.log('onCommand not defined', val);
	};

	let send = '';

	async function connectToBLE() {
		const con = await device.connect();
		BLEConnected = con;
		onCommand = (val: string) => {
			console.info('got command', val);
			const [service, value] = val.split(':');
			if (service in device) {
				// device[service]?.setVal(value); // TODO: FIX TYPINGS
			}
		};
	}
	$: {
		if (useVideo) {
			navigator.mediaDevices
				.getUserMedia({
					video: true
					//audio: true
				})
				.then((stream) => {
					peer1Store.update((s: PeerStore): PeerStore => {
						return {
							...s,
							mediaStream: stream
						};
					});
				});
		}
	}
</script>

<svelte:head>
	<title>Peer1</title>
</svelte:head>
<div>
	<div>
		<p>BLE device</p>
		{#if BLEConnected}
			<p>Not connected</p>
		{:else}
			<button on:click={() => connectToBLE()}>Connect BLE</button>
		{/if}
	</div>
	<p>Caller (initiator)</p>
	<label for="use-video">Use video</label>
	<input type="checkbox" id="use-video" bind:checked={useVideo} />
	{#if !$peer1Store.connected}
		<div>
			<h4>Calling peer2...</h4>
		</div>
	{/if}
	{#if $peer1Store.dataConn}
		<div>
			<h4>Connected to Peer2</h4>
			<p>has dataConn: {$peer1Store.dataConn ? 'true' : 'false'}</p>
			<button on:click={() => $peer1Store.dataConn?.send({ message: 'ping!', date: new Date() })}
				>Send data</button
			>
		</div>
	{/if}
</div>

<style>
</style>
