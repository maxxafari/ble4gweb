<script lang="ts">
	import { bindCommands } from '$lib/commands';
	import { peer2Store } from './peer2';

	let send = '';
	let data: string[] = [];
	let video: HTMLVideoElement;
	let command = $peer2Store.command;
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
</script>

<svelte:head>
	<title>Peer2</title>
</svelte:head>
<div>
	{#if !$peer2Store.connected}
		<p>Waiting for call (NOT initiator)</p>
		<div>
			<h4>Waiting for call from peer1</h4>
		</div>
	{/if}
	{#if $peer2Store.connected}
		<div>
			<h4>Connected to peer1</h4>
		</div>
		<div>
			<textarea id="send" bind:value={send} />
			<button
				on:click={() => {
					$peer2Store.dataConn?.send(send);
					send = '';
				}}>Send</button
			>
		</div>
		<button on:click={() => command.setLed(1, false)}>0</button>
		<button on:click={() => command.setLed(1, true)}>1</button>
		<div>
			<h3>data</h3>
			<ul>
				{#each data as d}
					<li>{d}</li>
				{/each}
			</ul>
		</div>
		w {#if !$peer2Store.mediaStream}
			<p>No video streamed</p>
		{/if}
		<div class="video-container">
			<!-- svelte-ignore a11y-media-has-caption -->
			<video bind:this={video} autoplay muted />
		</div>
	{/if}
</div>

<style>
	textarea {
		width: 300px;
		min-height: 200px;
	}
	video {
		width: 100%;
		max-width: 600px;
		min-height: 200px;
	}
</style>
