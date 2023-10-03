import { Loader } from '@googlemaps/js-api-loader';
import { PUBLIC_GOOGLE_MAP_API_KEY } from '$env/static/public';
const API_KEY = PUBLIC_GOOGLE_MAP_API_KEY;
const loader = new Loader({
	apiKey: API_KEY,
	version: 'weekly'
});

export async function loadMap(container: HTMLElement | undefined): Promise<google.maps.Map | null> {
	if (!container) return null;
	try {
		await loader.load();
		const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
		const map = new Map(container, {
			center: { lat: 59.3293, lng: 18.0686 },
			zoom: 20,
			heading: 0,
			mapId: '64d34eef4f3f8f1' // bound to a map style https://console.cloud.google.com/google/maps-apis/studio/maps/64d34eef4f3f8f1?project=ble-blos
		});
		window.map = map;
		return map;
	} catch (error) {
		console.error('error loading map', error);
		console.warn('disable ad blockers for map styles to work');
		throw error;
	}
}
