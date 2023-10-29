<script lang="ts">
	import SpeedControl from './SpeedControl.svelte';
	import Gps from '$lib/components/gps/Gps.svelte';
	import { peer2Store } from './peer2';
	import Status from '$lib/components/Status.svelte';
	import type { Unsubscriber } from 'svelte/store';
	import ControlWithStore from '$lib/components/control/ControlWithStore.svelte';
	// commands that can be forwarded to BLE device over dataConn

	let video: HTMLVideoElement;
	let angle = 0;
	let unsubscribe: Unsubscriber;
	$: {
		if ($peer2Store.mediaStream && video) {
			video.srcObject = $peer2Store.mediaStream;
		}
	}
</script>

<svelte:head>
	<title>Peer2</title>
</svelte:head>
<div>
	{#if !$peer2Store.dataConn?.open}
		<p>Waiting for call (NOT initiator)</p>
	{:else}
		<div>
			<h4>Connected to peer1</h4>
		</div>

		<input type="range" min="0" max="180" bind:value={angle} />

		{#if !$peer2Store.mediaStream}
			<p>No video streamed</p>
		{:else}
			<div class="video-container">
				<!-- svelte-ignore a11y-media-has-caption -->
				<video bind:this={video} autoplay muted />
			</div>
		{/if}
		<SpeedControl />
		<Gps />
		<Status />
	{/if}
</div>

<ControlWithStore />

<style>
	video {
		width: 100%;
		max-width: 600px;
		min-height: 200px;
	}
</style>
