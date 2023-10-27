<script lang="ts">
	import ControlWithStore from './../../lib/components/control/ControlWithStore.svelte';
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
	let stearingStoreUnsubscribe: Unsubscriber | null = null;

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

	if (!stearingStoreUnsubscribe)
		// is this correct ??
		stearingStoreUnsubscribe = stearingStore.subscribe((stearing) => {
			// if (stearingStoreUnsubscribe) stearingStoreUnsubscribe(); this doent work...
			console.log('stearingStore upd:', stearing);
			if (!BLEConnected) {
				console.warn('command not sent, BLE not connected');
				return;
			}
			console.info('sending command to BLE device');
			const { lm, rm } = stearing;
			const uint8array = new TextEncoder().encode('X' + 'L' + 'R' + 'l' + 'r'); // placehoders fol values
			uint8array[1] = Math.abs(lm); // left speed
			uint8array[2] = Math.abs(rm); // right speed
			uint8array[3] = lm < 0 ? 1 : 0; // left direction
			uint8array[4] = rm < 0 ? 1 : 0; // right direction
			device.leds.setValRaw(uint8array.buffer); // its still called leds but will fix all stearing stuff
			return;
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
			<p>BLE connected</p>
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
			<button on:click={() => $peer1Store.dataConn?.send({ message: 'ping!', date: new Date() })}
				>Send data</button
			>
		</div>
	{/if}
	<Status isSender />
	<ControlWithStore />
</div>

<style>
</style>
