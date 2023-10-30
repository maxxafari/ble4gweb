<script lang="ts">
	import ConnectBle from './../../lib/components/ConnectBle.svelte';
	import { preventScreenLock } from '$lib/utils';
	import ControlWithStore from '$lib/components/control/ControlWithStore.svelte';
	import Status from '$lib/components/Status.svelte';
	import type { PeerStoreObj } from '$lib/peers';
	import { peer1Store } from './peer1';
	import { bindStearingToBle } from '$lib/transferToBle';
	import Horn from '$lib/components/Horn.svelte';
	import Lights from '$lib/components/Lights.svelte';

	let BLEConnected = false;
	let useVideo = false;

	preventScreenLock();
	bindStearingToBle();

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
	<ConnectBle />
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
	<Horn />
	<Lights />
</div>

<style>
</style>
