<script lang="ts">
	import { getIceServerList } from '$lib/iceServers';
	import { CallPeer2, WaitForCallAnswerFromPeer2 } from '$lib/signalServer';
	import Peer, { type SignalData } from 'simple-peer';
	let initiator = true;
	let peer1: Peer.Instance | null = null;

	let offer = '';
	let connected = false;
	let send = '';
	let data: string[] = [];

	const load = async () => {
		console.log('onload...');
		const iceServers = await getIceServerList();

		peer1 = new Peer({
			initiator,
			trickle: false,
			config: {
				iceServers
			}
		});

		peer1.on('error', (err) => console.log('error', err));

		peer1.on('signal', async (data: SignalData) => {
			// when we have a call from peer2, we open the connection
			console.info('Got my signal object form ice server');
			await CallPeer2(data);
			const answer = await WaitForCallAnswerFromPeer2();
			peer1?.signal(answer);

			// now we should get a connection
		});

		peer1.on('connect', () => {
			console.log('CONNECT');
			connected = true;
			peer1?.send('whatever' + new Date().toISOString());
		});

		peer1.on('close', () => {
			console.log('CLOSE');
			connected = false;
		});
		peer1.on('error', (err: any) => {
			console.error('error', err);
			connected = false;
		});

		peer1.on('data', (d: any) => {
			console.log('GOT data:', d);
			try {
				data.push(d.toString());
				data = data;
			} catch (e) {
				console.error('could not parse data to string :/', d);
			}
			// window.data = data;
		});
	};
	load();
</script>

<div>
	<p>Caller (initiator)</p>
	{#if !connected}
		<div>
			<h4>Calling peer2</h4>
		</div>
	{/if}
	{#if connected}
		<div>
			<h4>Connected</h4>
			<p>connected: {connected ? 'true' : 'false'}</p>
		</div>
		<div>
			<textarea id="send" bind:value={send} />
			<button
				on:click={() => {
					peer1?.send(send);
					send = '';
				}}>Send</button
			>
		</div>
		<div>
			<h3>data</h3>
			<ul>
				{#each data as d}
					<li>{d}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	textarea {
		width: 300px;
		min-height: 200px;
	}
</style>
