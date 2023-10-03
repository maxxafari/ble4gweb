<script lang="ts">
	import { loadMap } from './load';

	let container: HTMLElement;
	let map: google.maps.Map | null = null;
	let zoom = 20;
	let compass: number | null = 0;
	let compassCorrection = 360 / 2;
	// lat long stockholm
	let center = { lat: 59.3293, lng: 18.0686 };
	// get browser location
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			center = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
		});
	}
	// get compass heading
	if (window.DeviceOrientationEvent) {
		// Listen for the deviceorientation event and handle the raw data
		window.addEventListener('deviceorientation', function (event) {
			if (event.webkitCompassHeading) {
				// Apple works only with this, alpha doesn't work TODO verify!
				compass = event.webkitCompassHeading;
			} else compass = event.alpha; // might be beta or  gamma // add corrections in interface
		});
	}

	$: loadMap(container).then((gMap) => {
		map = gMap;
	});

	function fixOrientation(deviceDegrees: number, offset: number) {
		console.log('fixOrientation', offset, map);

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
