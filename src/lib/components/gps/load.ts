import { Loader } from '@googlemaps/js-api-loader';
import { PUBLIC_GOOGLE_MAP_API_KEY } from '$env/static/public';
const API_KEY = PUBLIC_GOOGLE_MAP_API_KEY;
const loader = new Loader({
	apiKey: API_KEY,
	version: 'weekly'
});
type MapNMarker = {
	map: google.maps.Map;
	deviceMarker: google.maps.Marker;
};

const icon = '/map-dot.png';
export async function loadMap(container: HTMLElement | undefined): Promise<MapNMarker | null> {
	if (!container) return null;
	try {
		await loader.load();
		const center = { lat: 59.3293, lng: 18.0686 };
		const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
		const map = new Map(container, {
			center,
			zoom: 20,
			heading: 0,
			streetViewControl: false,

			mapId: '64d34eef4f3f8f1' // bound to a map style https://console.cloud.google.com/google/maps-apis/studio/maps/64d34eef4f3f8f1?project=ble-blos
		});
		const deviceMarker = new google.maps.Marker({
			position: center,
			map,
			icon
		});
		window.map = map;
		return { map, deviceMarker };
	} catch (error) {
		console.error('error loading map', error);
		console.warn('disable ad blockers for map styles to work');
		throw error;
	}
}
