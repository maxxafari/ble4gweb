<script lang="ts">
	import { statusStore } from '$lib/statusStore';

	import { loadMap } from './load';

	let container: HTMLElement;
	let map: google.maps.Map | null = null;
	let deviceMarker: google.maps.Marker | null = null;
	let compass = $statusStore.compass;
	let compassCorrection = 360 / 2;

	$: loadMap(container).then((gMap) => {
		if (!gMap) return;
		map = gMap.map;
		deviceMarker = gMap.deviceMarker;
	});

	statusStore.subscribe((s) => {
		if (map && deviceMarker) {
			//deviceMarker.setPosition(s.gps);
			if (s.gps.lat && s.gps.lng) {
				map.setCenter({ lat: s.gps.lat, lng: s.gps.lng });
				deviceMarker.setPosition({ lat: s.gps.lat, lng: s.gps.lng });
			}
		}
	});

	function fixOrientation(deviceDegrees: number, offset: number) {
		map?.setHeading(deviceDegrees + offset);
	}
	$: fixOrientation(compass || 0, compassCorrection);
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
