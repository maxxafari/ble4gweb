<script lang="ts">
	import { device } from '$lib/device';
	import Status from '$lib/components/Status.svelte';
	import type { PeerStoreObj } from '$lib/peers';
	import { peer1Store } from './peer1';
	import { stearingStore } from '$lib/stearingStore';
	import type { Unsubscriber } from 'svelte/motion';

	// BLE stuff
	let BLEConnected = false;
	let useVideo = true;
	let wakeLock: WakeLockSentinel | null = null;
	let stearingStoreUnsubscribe: Unsubscriber;

	async function connectToBLE() {
		const con = await device.connect();
		BLEConnected = con;
	}

	navigator.wakeLock
		.request('screen')
		.then((wl) => {
			wakeLock = wl;
		})
		.catch((e) => {
			console.log('wakeLock error', e);
		});
	//

	stearingStoreUnsubscribe = stearingStore.subscribe((stearing) => {
		if (stearingStoreUnsubscribe) stearingStoreUnsubscribe();
		console.log('stearingStore upd:', stearing);
		if (!BLEConnected) {
			console.warn('command not sent, BLE not connected');
			return;
		}
		const { gear, dir, speed } = stearing;
		const uint8array = new TextEncoder().encode('X' + gear + dir + 'P'); // P = placeholder for int speed);
		uint8array[3] = speed;
		device.leds.setValRaw(uint8array.buffer); // its still called leds but will fix all stearing stuff
		return;
		// case 'L': {
		// 	device.leds.setVal((c.value as boolean) ? '11' : '00'); // terrible interface fix this.
		// 	return;
		// }
		// case 'S': {
		// 	device.servo.setVal(c.value as number);
		// 	return;
		// }
		// default: {
		// 	console.warn('unknown command', c);
		// 	return;
		// }
	});

	$: {
		if (useVideo) {
			navigator.mediaDevices
				.getUserMedia({
					video: {
						facingMode: 'environment'
					}
					//audio: true
				})
				.then((stream) => {
					peer1Store.update((s: PeerStoreObj): PeerStoreObj => {
						return {
							...s,
							mediaStream: stream
						};
					});
				})
				.catch((e) => {
					useVideo = false;
					console.log('getUserMedia error', e);
				});
		}
		if (!useVideo) {
			peer1Store.update((s: PeerStoreObj): PeerStoreObj => {
				return {
					...s,
					mediaStream: null
				};
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
	{#if !$peer1Store.dataConn}
		<div>
			<h4>Calling peer2...</h4>
		</div>
	{/if}
	{#if $peer1Store.dataConn}
		<div>
			<h4>Connected to Peer2</h4>
			<p>steering: {$stearingStore.dir} {$stearingStore.gear} {$stearingStore.speed}</p>
			<button on:click={() => $peer1Store.dataConn?.send({ message: 'ping!', date: new Date() })}
				>Send data</button
			>
		</div>
	{/if}
	<Status isSender />
</div>

<style>
</style>
