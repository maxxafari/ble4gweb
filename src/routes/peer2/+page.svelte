<script lang="ts">
	import { device } from '$lib/device';
	import { peer2Store } from './peer2';

	let send = '';
	let data: string[] = [];
	let video: HTMLVideoElement;

	$: {
		if ($peer2Store.mediaStream && video) {
			video.srcObject = $peer2Store.mediaStream;
		}
	}

	function passCommand(serviceName: string, value: string | number) {
		const commandString = serviceName + ':' + value;
		$peer2Store.dataConn?.send({
			type: 'message',
			data: commandString
		});
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
		<button on:click={() => passCommand('leds', '00')}>00</button>
		<button on:click={() => passCommand('leds', '11')}>11</button>
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
