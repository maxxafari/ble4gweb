import {
	bindConnection,
	createPeerWithIceServers,
	peer1Id,
	peer2Id,
	type PeerStore
} from '$lib/peers';
import type { Peer as PeerType } from 'peerjs';
import type { DataConnection } from 'peerjs';
import { writable, get } from 'svelte/store';

export const createPeer1 = async () => {
	console.info('Creating new peer1');
	const peer = await createPeerWithIceServers(peer1Id);

	peer.on('open', () => {
		console.info('peer open');
		connectToP2(peer);
	});

	peer1Store.update((s) => ({ ...s, peer: peer }));
	return peer;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let callFails = 0;
const connectToP2 = async (peer: PeerType) => {
	try {
		console.log('connecting to p2');
		const conn = peer.connect(peer2Id);

		bindConnection(conn);
		peer1Store.update((s) => ({ ...s, conn: conn, connected: true }));
		peer1Store.update((s) => ({ ...s, connected: true }));

		callFails = 0;
	} catch (e) {
		console.log('data conn to p2 failed', e);
		callFails++;
		setTimeout(() => {
			console.log('retrying conn to p2');
			connectToP2(peer);
		}, 10000);
	}
};

export const lastMessage = writable<string>('');

export const peer1Store = writable<PeerStore>(
	{
		created: false,
		connected: false,
		videoStream: null,
		peer: null,
		conn: null
	},
	() => {
		if (get(peer1Store).created) return;
		peer1Store.update((s) => ({ ...s, created: true }));
		console.info('new subscription for peer1');
		createPeer1().then((peer) => {
			peer1Store.update((s) => ({ ...s, peer: peer }));
		});
		return () => {
			console.log('TODO, destroy peer1');
		};
	}
);

// peer1Store.subscribe((s) => {
// 	if (s.videoStream && s.peer && s.peer.streams.length === 0) {
// 		console.log('peer1Store Adding stream', s);
// 		s.peer.addStream(s.videoStream);
// 	}
// });
