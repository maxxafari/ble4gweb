<script lang="ts">
	import Peer from 'simple-peer';
	let initiator = location.hash === '#1';
	const p = new Peer({
		initiator,
		trickle: false
	});

	let textContent = '';
	let incoming = '';
	let signal = '';

	let data: string[] = [];

	p.on('error', (err) => console.log('error', err));

	p.on('signal', (data) => {
		console.log('SIGNAL', JSON.stringify(data));
		signal = JSON.stringify(data);
	});

	function submit() {
		console.log('SUBMIT!: ', JSON.parse(incoming));
		p.signal(JSON.parse(incoming));
	}

	p.on('connect', () => {
		console.log('CONNECT');
		p.send('whatever' + new Date().toISOString);
	});

	p.on('data', (data) => {
		console.log('CONNECT');
		data.push(data);
	});
</script>

<div>
	<p>initiator: {initiator ? 'true' : 'false'}</p>
	<h4>signal</h4>
	<pre>{signal}</pre>
	<div>
		<h4>Incomping</h4>
		<textarea id="incoming" bind:value={incoming} />
		<br />
		<button on:click={() => submit()}>Submit</button>
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
