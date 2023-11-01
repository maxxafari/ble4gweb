<script>
	import { onMount } from 'svelte';
	import { peer1Store, createPeer1 } from './peer1';
	let connectingToServer = false;
	let connectedToServer = false;
	let connectedToDriver = $peer1Store.dataConn;
	function startRTC() {
		connectingToServer = true;
		createPeer1(peer1Store);
	}
	onMount(() => {
		const interval = setInterval(() => {
			if ($peer1Store.peer) {
				connectedToServer = !$peer1Store.peer.disconnected;
			} else {
				connectedToServer = false;
			}
			connectedToDriver = $peer1Store.dataConn;
			$peer1Store.dataConn?.send('ping');
		}, 2000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<div>
	{#if connectingToServer || connectedToServer}
		<ul>
			<li>Web-RTC server {$peer1Store.open ? '🟢' : '🔴'}</li>
			<!-- // this does not work. dataConn remains open , use polling -->
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
