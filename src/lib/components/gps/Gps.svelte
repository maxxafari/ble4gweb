<script lang="ts">
	import { loadMap } from './load';

	let container: HTMLElement;
	let map: google.maps.Map | null = null;
	let deviceMarker: google.maps.Marker | null = null;
	let zoom = 20;
	let compass: number | null = 0;
	let compassCorrection = 360 / 2;
	// lat long stockholm
	let center = { lat: 59.3293, lng: 18.0686 };

	$: loadMap(container).then((gMap) => {
		if (!gMap) return;
		map = gMap.map;
		deviceMarker = gMap.deviceMarker;
	});

	function fixOrientation(deviceDegrees: number, offset: number) {
		map?.setHeading(deviceDegrees + offset);
	}
	$: fixOrientation(0, compassCorrection);
</script>

<div class="full-screen" bind:this={container} />
<div>
	<label for="compassCorrection">Fix orientation</label>
	<input name="compassCorrection" type="range" min="0" max="360" bind:value={compassCorrection} />
</div>

<style>
	.full-screen {
		width: 50vw;
		height: 50vh;
		background: black;
	}
</style>
