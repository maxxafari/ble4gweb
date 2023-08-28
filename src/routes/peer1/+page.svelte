<script lang="ts">
	import Peer from 'simple-peer';
	let initiator = location.hash === '#1';
	let peer: Peer.Instance | null = null;

	let offer = '';
	let connected = false;
	let send = '';
	let data: string[] = [];

	const load = async () => {
		console.log('onload...');

		const response = await fetch(
			'https://maxxafari.metered.live/api/v1/turn/credentials?apiKey=3aea09a742976f93e50ffe3a1c7a287fc050'
		);
		const iceServers = await response.json();
		console.log('iceServers', iceServers);

		peer = new Peer({
			initiator,
			trickle: false,
			config: {
				iceServers
			}
		});

		window.peer = peer;

		peer.on('error', (err) => console.log('error', err));

		peer.on('signal', (data) => {
			console.log('SIGNAL', JSON.stringify(data));
			signal = JSON.stringify(data);
		});

		peer.on('connect', () => {
			console.log('CONNECT');
			connected = true;
			peer?.send('whatever' + new Date().toISOString());
		});

		peer.on('close', () => {
			console.log('CLOSE');
			connected = false;
		});
		peer.on('error', (err) => {
			console.error('error', err);
			connected = false;
		});

		peer.on('data', (d) => {
			console.log('GOT data:', d);
			try {
				data.push(d.toString());
				data = data;
			} catch (e) {
				console.error('could not parse data to string :/', d);
			}
			window.data = data;
		});
	};
	load();

	function signalWithResponse() {
		console.log('SUBMIT!: ', JSON.parse(offer));
		peer?.signal(JSON.parse(offer));
	}

	let textContent = '';
	let incoming = '';
	let signal = '';
</script>

<div>
	<p>initiator: {initiator ? 'true' : 'false'}</p>
	<h4>My signal</h4>
	<pre>{signal}</pre>
	{#if !connected}
		<div>
			<h4>Signal with data</h4>
			<textarea id="incoming" bind:value={offer} />
			<br />
			<button on:click={() => signalWithResponse()}>Signal</button>
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
					peer?.send(send);
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
