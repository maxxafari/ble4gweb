<script lang="ts">
	import { device } from '$lib/device';
	import ConnectBle from './../../lib/components/ConnectBle.svelte';
	import { preventScreenLock } from '$lib/utils';
	import ControlWithStore from '$lib/components/control/ControlWithStore.svelte';
	import Status from '$lib/components/Status.svelte';
	import type { PeerStoreObj } from '$lib/peers';
	import { peer1Store } from './peer1';
	import { bindStearingToBle } from '$lib/transferToBle';
	import Horn from '$lib/components/Horn.svelte';
	import Lights from '$lib/components/Lights.svelte';
	import ConnectRtc from './ConnectRTC.svelte';
	import { onMount } from 'svelte';

	let useVideo = false;

	onMount(() => {
		preventScreenLock();
		return bindStearingToBle();
		// how to do with multiple returns
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
	<h3>Open this page on vehicle device</h3>
	<ConnectBle />
	<ConnectRtc />
	<label for="use-video">Use video</label>
	<input type="checkbox" id="use-video" bind:checked={useVideo} />

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
