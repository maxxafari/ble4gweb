type IceServerList = RTCIceServer[];

export async function getIceServerList(): Promise<IceServerList> {
	const response = await fetch(
		'https://maxxafari.metered.live/api/v1/turn/credentials?apiKey=3aea09a742976f93e50ffe3a1c7a287fc050'
	);
	console.info('Got iceServers');

	const iceServers = await response.json();
	return iceServers;
}
