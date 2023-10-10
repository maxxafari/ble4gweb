<script lang="ts">
	import SpeedControl from './SpeedControl.svelte';
	import Gps from '$lib/components/gps/Gps.svelte';
	import { peer2Store } from './peer2';
	import { onKeyDown, onKeyUp, searingStore } from './stearing';
	import Status from '$lib/components/Status.svelte';
	// commands that can be forwarded to BLE device over dataConn

	let send = '';
	let data: string[] = [];
	let video: HTMLVideoElement;
	let command = $peer2Store.command;
	let angle = 0;
	$: {
		if ($peer2Store.mediaStream && video) {
			video.srcObject = $peer2Store.mediaStream;
		}
		if ($peer2Store.dataConn) {
			$peer2Store.dataConn.on('data', (d) => {
				console.log('got data: ', d);
			});
			command = $peer2Store.command;
		}
	}
	$: {
		if (angle) {
			command.setServo(1, angle);
		}
	}
	searingStore.subscribe((stearing) => {
		command.setStearing(stearing);
	});
</script>

<svelte:head>
	<title>Peer2</title>
</svelte:head>
<div>
	{#if !$peer2Store.connected}
		<p>Waiting for call (NOT initiator)</p>
	{:else}
		<div>
			<h4>Connected to peer1</h4>
		</div>

		<button on:click={() => command.setLed(1, false)}>0</button>
		<button on:click={() => command.setLed(1, true)}>1</button>
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

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<style>
	video {
		width: 100%;
		max-width: 600px;
		min-height: 200px;
	}
</style>
