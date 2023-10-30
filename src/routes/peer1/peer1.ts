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
	if (peer.disconnected) {
		console.warn('Disconnected from web-RTC server, reconnecting');
		peer.reconnect();
		return;
	}
	const dataConn = peer.connect(peer2Id);
	dataConn.once('open', () => {
		console.info('Web-RTC call is open');
		// this only fires on peer1
		bindDataConnectionToStore(dataConn, store);
		bindStatusStoreToConnUpStream(dataConn);
		bindStearingStoreToConnDownStream(dataConn);
		bindBtnStoreToConnDownStream(dataConn);
	});
	dataConn.once('close', () => {
		console.info('Web-RTC call closed calling peer2 again...');
		dataConn.removeAllListeners();
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
	peer?.on('error', (err) => {
		if (err.type === 'peer-unavailable') {
			// this fires 8 times on one connect...
			console.log('webRTC peer not available', err);
		} else {
			console.error('peerjs Peer error', { err });
		}
	});
	peer?.once('open', () => {
		connectToP2(store);
	});
};

export const peer1Store: PeerStore = writable<PeerStoreObj>(emptyPeerStore('peer1'));

peer1Store.subscribe(({ peer, mediaStream, mediaConn }) => {
	/* update media stream */
	if (mediaStream && peer && !mediaConn) {
		console.log('mediaStream added');
		const newMediaConn = peer?.call(peer2Id, mediaStream);
		peer1Store.update((s) => ({ ...s, mediaConn: newMediaConn }));
	} else if (!mediaStream && mediaConn) {
		console.log('mediaStream cleared');
		mediaConn.close();
		peer1Store.update((s) => ({ ...s, mediaConn: null }));
	}
});
