<script lang="ts">
	export let isSender = false;
	import { statusStore as stat } from '../statusStore';
	import Battery from './Battery.svelte';
	let compass: number | null = 0;
	if (isSender) {
		// get browser location
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {});
		}
		navigator.geolocation.watchPosition((position) => {
			stat.update((s) => ({
				...s,
				gps: {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
					alt: position.coords.altitude,
					accuracy: position.coords.accuracy
				}
			}));
		});

		// get compass heading
		if (window.DeviceOrientationEvent) {
			// Listen for the deviceorientation event and handle the raw data
			window.addEventListener('deviceorientation', function (event) {
				// if (event.webkitCompassHeading) {
				// Apple works only with this, alpha doesn't work TODO verify!
				// compass = event.webkitCompassHeading;
				// } else
				compass = event.alpha; // might be beta or  gamma // add corrections in interface
			});
			stat.update((s) => ({
				...s,
				compass
			}));
		}
	}
</script>

<div>
	<ul>
		<li>
			<span class="label">Phone</span>
			<Battery percent={$stat.phoneBattery} />
		</li>
		<li>
			<span class="label">BLE </span>
			<Battery percent={$stat.bleBattery} />
		</li>
		<li>
			<span class="label">Gps Acc</span>
			{$stat.gps.accuracy}
		</li>
	</ul>
</div>

<style>
	li {
		display: flex;
		align-items: center;
	}
</style>
