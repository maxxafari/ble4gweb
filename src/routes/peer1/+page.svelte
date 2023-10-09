<script lang="ts">
	import type { SearingStore } from '../peer2/stearing.ts';
	import { device } from '$lib/device';
	import Status from '$lib/components/Status.svelte';
	import type { PeerStore } from '$lib/peers';
	import { lastCommand, peer1Store } from './peer1';

	// BLE stuff
	let BLEConnected = false;
	let useVideo = true;
	let wakeLock: WakeLockSentinel | null = null;
	let send = '';

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

	lastCommand.subscribe((c) => {
		if (c) {
			console.log('got command', c);
			if (!BLEConnected) console.warn('command not sent, BLE not connected');
			switch (c.key) {
				case 'X': {
					const { gear, direction, speed } = c.value as SearingStore;
					const uint8array = new TextEncoder().encode('X' + gear + direction + 'P'); // P = placeholder for int speed);
					uint8array[3] = speed;
					device.leds.setValRaw(uint8array.buffer);
					return;
				}
				case 'L': {
					device.leds.setVal((c.value as boolean) ? '11' : '00'); // terrible interface fix this.
					return;
				}
				case 'S': {
					device.servo.setVal(c.value as number);
					return;
				}
				default: {
					console.warn('unknown command', c);
					return;
				}
			}
		}
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
					peer1Store.update((s: PeerStore): PeerStore => {
						return {
							...s,
							mediaStream: stream
						};
					});
				});
		}
		if (!useVideo) {
			peer1Store.update((s: PeerStore): PeerStore => {
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
	<Status isSender />
</div>

<style>
</style>
