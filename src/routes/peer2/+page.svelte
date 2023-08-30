<script lang="ts">
	import { getIceServerList } from '$lib/iceServers';
	import { AnswerCallFromPeer1, CallPeer2, WaitForCallFromPeer1 } from '$lib/signalServer';
	import Peer, { type SignalData } from 'simple-peer';
	let initiator = false;
	let peer2: Peer.Instance | null = null;

	let connected = false;
	let send = '';
	let data: string[] = [];

	const load = async () => {
		console.log('onload...');
		const iceServers = await getIceServerList();

		peer2 = new Peer({
			initiator, // false
			trickle: false,
			config: {
				iceServers
			}
		});

		peer2.on('error', (err) => console.log('error', err));

		// this will not trigger until we call peer2.signal(answer)
		peer2.on('signal', async (data: SignalData) => {
			// wen we have a call and have created an answer we send it back to peer1
			console.info('answering call from peer1', data);
			AnswerCallFromPeer1(data);
			// now we should get a connection
		});

		peer2.on('connect', () => {
			console.log('CONNECT');
			connected = true;
			peer2?.send('whatever' + new Date().toISOString());
		});

		peer2.on('close', () => {
			console.log('CLOSE');
			connected = false;
		});
		peer2.on('error', (err: any) => {
			console.error('error', err);
			connected = false;
		});

		peer2.on('data', (d: any) => {
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
	async function waitForCall() {
		try {
			const answer = await WaitForCallFromPeer1();
			peer2?.signal(answer);
		} catch (e) {
			console.error('Did not get a call from peer1', e);
			console.info('Waiting for call again...');
			// waitForCall();
		}
	}
	waitForCall();
</script>

<div>
	<p>Waiting for call (NOT initiator)</p>
	{#if !connected}
		<div>
			<h4>Waiting for call from peer1</h4>
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
					peer2?.send(send);
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
