<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { mapStyle } from './mapStyle';
	import { PUBLIC_GOOGLE_MAP_API_KEY } from '$env/static/public';
	const API_KEY = PUBLIC_GOOGLE_MAP_API_KEY;
	const loader = new Loader({
		apiKey: API_KEY,
		version: 'weekly'
		// TODO: add styles:
	});

	let container: HTMLElement;
	let map;
	let zoom = 8;
	let center = { lat: -34.397, lng: 150.644 };

	import { onMount } from 'svelte';

	$: {
		if (container) {
			loader.load().then(async () => {
				const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
				map = new Map(container, {
					center: { lat: -34.397, lng: 150.644 },
					zoom: 8
				});
			});
		}
	}
</script>

<div class="full-screen" bind:this={container} />

<style>
	.full-screen {
		width: 50vw;
		height: 50vh;
		background: black;
	}
</style>
