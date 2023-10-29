import {
	bindDataConnectionToStore,
	createPeerWithIceServers,
	emptyPeerStore,
	peer1Id,
	peer2Id,
	type PeerStore,
	type PeerStoreObj
} from '$lib/peers';
import { bindStatusStoreToConnUpStream } from '$lib/statusStore';
import { writable, get } from 'svelte/store';
import { bindStearingStoreToConnDownStream } from '../../lib/stearingStore';
import { bindBtnStoreToConnDownStream } from '$lib/buttonStore';

const connectToP2 = async (store: PeerStore) => {
	const peer = get(peer1Store).peer;
	if (!peer) throw new Error('Peer is null when calling p2');
	const dataConn = peer.connect(peer2Id);
	dataConn.once('open', () => {
		// this only fires on peer1
		bindDataConnectionToStore(dataConn, store);
		bindStatusStoreToConnUpStream(dataConn);
		bindStearingStoreToConnDownStream(dataConn);
		bindBtnStoreToConnDownStream(dataConn);
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

export const createPeer1 = async (store: PeerStore) => {
	console.info('Creating new peer1');
	await createPeerWithIceServers(peer1Id, store);
	const peer = get(store).peer;
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

export const peer1Store: PeerStore = writable<PeerStoreObj>(emptyPeerStore('peer1'), () => {
	console.info('new subscription for peer1');
	if (get(peer1Store).peer === null) createPeer1(peer1Store);
	return () => {
		console.info('No subscription  peer1');
	};
});

peer1Store.subscribe(({ peer, mediaStream, mediaConn }) => {
	if (mediaStream && peer && !mediaConn) {
		console.log('mediaStream changed');
		const newMediaConn = peer?.call(peer2Id, mediaStream);
		peer1Store.update((s) => ({ ...s, mediaConn: newMediaConn }));
	} else if (!mediaStream && mediaConn) {
		console.log('mediaStream cleared');
		mediaConn.close();
		peer1Store.update((s) => ({ ...s, mediaConn: null }));
	}
});
