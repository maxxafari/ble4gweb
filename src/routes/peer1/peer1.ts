import {
	bindDataConnectionToStore,
	createPeerWithIceServers,
	emptyPeerStore,
	peer1Id,
	peer2Id,
	type PeerStore
} from '$lib/peers';
import { writable, get, type Writable } from 'svelte/store';

const connectToP2 = async (store: Writable<PeerStore>) => {
	const peer = get(peer1Store).peer;
	if (!peer) throw new Error('Peer is null when calling p2');
	const dataConn = peer.connect(peer2Id);
	dataConn.once('open', () => {
		bindDataConnectionToStore(dataConn, store);
	});
	dataConn.once('close', () => {
		console.info('data connection closed calling p2 again...');
		connectToP2(store);
	});
	setTimeout(() => {
		// see if peer2 is connected if not try again
		console.info('checking if peer2 is connected: ', dataConn.peerConnection?.connectionState);
		if (!['connecting', 'connected'].includes(dataConn.peerConnection?.connectionState)) {
			dataConn.removeAllListeners();
			console.info('retrying connection to peer2');
			connectToP2(store);
		}
	}, 8000);
};

export const createPeer1 = async (store: Writable<PeerStore>) => {
	console.info('Creating new peer1');
	await createPeerWithIceServers(peer1Id, store);
	const peer = get(peer1Store).peer;
	if (!peer) throw new Error('Peer is null when calling p2');
	// add unique error handlers for peer1
	peer?.on('error', (err) => {
		if (err.type === 'peer-unavailable') {
			// this fires 8 times on one connect...
			console.log('peer unavailable');
		}
	});
	peer?.once('open', () => {
		connectToP2(store);
	});
};

export const lastMessage = writable<string>('');

export const peer1Store = writable<PeerStore>(emptyPeerStore, () => {
	console.info('new subscription for peer1');
	if (get(peer1Store).peer === null) createPeer1(peer1Store);
	return () => {
		console.info('No subscription  peer1');
	};
});

peer1Store.subscribe(({ peer, mediaStream, mediaConn }) => {
	if (mediaStream && peer && !mediaConn) {
		console.log('mediaStream changed');
		peer?.call(peer2Id, mediaStream);
	}
});
