<script>
	import { onMount } from 'svelte';
	import { peer1Store, createPeer1 } from './peer1';
	let connected = false;
	let connecting = false;
	function startRTC() {
		connecting = true;
		createPeer1(peer1Store);
	}
	onMount(() => {
		const interval = setInterval(() => {
			if ($peer1Store.peer) {
				connected = !$peer1Store.peer.disconnected;
			} else {
				connected = false;
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<div>
	{#if connecting || connected}
		<ul>
			<li>Web-RTC server {$peer1Store.open ? '🟢' : '🔴'}</li>
			<li>Driver {$peer1Store.dataConn ? '🟢' : '🔴'}</li>
		</ul>
	{:else}
		<div class="connect">
			<span>Driver</span>
			<button on:click={startRTC}>Connect to driver</button>
		</div>
	{/if}
</div>

<style>
	ul {
		list-style: none;
		padding-inline-start: 0px;
	}
	.connect {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	button {
		height: 1fr;
	}
</style>
