<script lang="ts">
	import Peer from 'simple-peer';
	let initiator = location.hash === '#1';
	let peer: Peer.Instance | null = null;
	onload = async () => {
		const response = await fetch(
			'https://maxxafari.metered.live/api/v1/turn/credentials?apiKey=3aea09a742976f93e50ffe3a1c7a287fc050'
		);
		const iceServers = await response.json();
		peer = new Peer({
			initiator,
			trickle: false,
			config: {
				iceServers
			}
		});
		peer.on('error', (err) => console.log('error', err));

		peer.on('signal', (data) => {
			console.log('SIGNAL', JSON.stringify(data));
			signal = JSON.stringify(data);
		});

		peer.on('connect', () => {
			console.log('CONNECT');
			peer?.send('whatever' + new Date().toISOString);
		});

		peer.on('data', (data) => {
			console.log('CONNECT');
			data.push(data);
		});
	};

	let textContent = '';
	let incoming = '';
	let signal = '';

	let data: string[] = [];
</script>

<div>
	<p>initiator: {initiator ? 'true' : 'false'}</p>
	<h4>signal</h4>
	<pre>{signal}</pre>
	<div>
		<h4>Incomping</h4>
		<textarea id="incoming" bind:value={incoming} />
		<br />
	</div>
	<div>
		<h3>data</h3>
		<ul>
			{#each data as d}
				<li>{d}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	textarea {
		width: 300px;
		min-height: 200px;
	}
</style>
