<script lang="ts">
	import QRious from 'qrious';
	import { onMount } from 'svelte';

	export let value = '';

	let canvas: HTMLCanvasElement;

	function setQr(newValue: string) {
		var qr = new QRious({
			element: canvas,
			value: newValue
		});
	}
	onMount(() => {
		setQr(value);
	});
	$: setQr(value);
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		width: 100%;
		height: 100%;
		aspect-ratio: 1 / 1;
	}
</style>
