<script>
	import QrCode from '$lib/components/qr/QrCode.svelte';
</script>

<svelte:head>
	<title>Qr</title>
</svelte:head>
<div>
	<p>Qr</p>
	<QrCode value="https://svelte.dev" />
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
