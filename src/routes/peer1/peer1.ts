import {
	createPeerWithIceServers,
	emptyPeerStore,
	peer1Id,
	peer2Id,
	type PeerStore
} from '$lib/peers';
import type { Peer as PeerType } from 'peerjs';
import { writable, get, type Writable } from 'svelte/store';

export const createPeer1 = async (store: Writable<PeerStore>) => {
	console.info('Creating new peer1');
	const peer = await createPeerWithIceServers(peer1Id, store);
	peer.on('open', () => {
		connectToP2(peer);
	});
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let callFails = 0;
const connectToP2 = async (peer: PeerType) => {
	try {
		console.log('connecting to p2');
		const conn = peer.connect(peer2Id);
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
