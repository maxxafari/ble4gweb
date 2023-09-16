import {
	bindDataConnectionToStore,
	createPeerWithIceServers,
	emptyPeerStore,
	peer1Id,
	peer2Id,
	type PeerStore
} from '$lib/peers';
import type { DataConnection, Peer as PeerType } from 'peerjs';
import { writable, get, type Writable } from 'svelte/store';

export const createPeer1 = async (store: Writable<PeerStore>) => {
	console.info('Creating new peer1');
	await createPeerWithIceServers(peer1Id, store);
	const peer = get(peer1Store).peer;
	peer?.on('open', () => {
		const dataConn = peer.connect(peer2Id);
		bindDataConnectionToStore(dataConn, store);
	});
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let callFails = 0;
const connectToP2 = async (peer: PeerType) => {
	try {
		console.log('connecting to p2');
		const dataConn = peer.connect(peer2Id);
		const store = peer1Store;
		// will it fail here?

		callFails = 0;
	} catch (e) {
		console.log('data conn to p2 failed', e);
		callFails++;
		// setTimeout(() => {
		// 	console.log('retrying conn to p2', callFails);
		// 	connectToP2(peer);
		// }, 10000);
	}
};

export const lastMessage = writable<string>('');

export const peer1Store = writable<PeerStore>(emptyPeerStore, () => {
	console.info('new subscription for peer1');
	createPeer1(peer1Store);
	return () => {
		console.info('destroy  peer1');
		get(peer1Store).peer?.destroy();
	};
});
