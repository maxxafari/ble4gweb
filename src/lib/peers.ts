import { Peer } from 'peerjs';
import type {
	Peer as PeerType,
	DataConnection as DataConnectionType,
	MediaConnection as MediaConnectionType
} from 'peerjs';
import { getIceServerList } from './iceServers';
import { get, type Writable } from 'svelte/store';
import { bindStatusStoreToConnDownStream } from './statusStore';
import { bindStearingStoreToConnUpStream } from './stearingStore';

export const peer1Id = 'ble-controller-p1';
export const peer2Id = 'ble-controller-p2';

export type PeerStoreKey = 'peer1' | 'peer2';

export type PeerStoreObj = {
	key: PeerStoreKey;
	created: boolean;
	connected: boolean;
	open: boolean;
	mediaStream: MediaStream | null;
	peer: PeerType | null;
	dataConn: DataConnectionType | null;
	mediaConn: MediaConnectionType | null;
};

export const emptyPeerStore = (key: PeerStoreKey): PeerStoreObj => ({
	key,
	created: false,
	connected: false,
	mediaStream: null,
	open: false,
	peer: null,
	dataConn: null,
	mediaConn: null
});

export type PeerStore = Writable<PeerStoreObj>;

export const clearStore = (store: PeerStore) => {
	console.log('clearing store');
	const { peer, dataConn, mediaConn, mediaStream, key } = get(store);
	if (dataConn) dataConn.close();
	if (mediaConn) mediaConn.close();
	if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
	if (peer) peer.destroy();
	store.set(emptyPeerStore(key));
};
export const createPeerWithIceServers = async (peerId: string, store: PeerStore) => {
	const iceServers = await getIceServerList();
	const peer = new Peer(peerId, {
		config: {
			iceServers: iceServers,
			debug: 3
		}
	});
	bindPeerToStore(peer, store);
	return peer;
};

const bindPeerToStore = (peer: PeerType, store: PeerStore) => {
	const { key } = get(store);
	store.update((s): PeerStoreObj => {
		s.peer?.removeAllListeners();
		s.peer?.destroy();
		return { ...s, peer: peer };
	});
	peer.on('open', () => {
		console.info('peer open, connected to server');
		store.update((s): PeerStoreObj => ({ ...s, open: true }));
	});
	peer.on('connection', (conn) => {
		// this only fires for peer2 // use dataConn.once('open', for pper1
		console.info('peer got connection');
		bindDataConnectionToStore(conn, store);
		if (key === 'peer2') {
			bindStatusStoreToConnDownStream(conn);
			bindStearingStoreToConnUpStream(conn);
		}
	});
	peer.on('call', (mediaConn) => {
		// peer 2 only
		console.info('answering call');
		bindMediaConnectionToStore(mediaConn, store);
		mediaConn.answer();
		console.info('waiting for call');
	});

	peer.on('close', () => {
		console.info('peer closed,  ');
		// peer.reconnect();
	});
	peer.on('disconnected', () => {
		console.info('peer disconnected,  ');
		// peer.reconnect();
	});
	peer.on('error', (err) => {
		if (err?.type !== 'peer-unavailable') console.error('peer error', { err });
	});
};

export const bindDataConnectionToStore = (dataConn: DataConnectionType, store: PeerStore) => {
	store.update((s): PeerStoreObj => {
		console.log('bindCommands!');
		s.dataConn?.removeAllListeners();
		s.dataConn?.close();

		return { ...s, dataConn };
	});

	dataConn.on('data', (data) => {
		console.info('dataConn gotData', data);
	});
	dataConn.on('open', () => {
		console.info('dataConn open!');
		store.update((s): PeerStoreObj => ({ ...s, connected: true }));
		dataConn.send('hello!');
	});
	dataConn.on('close', () => {
		console.info('dataConn closed');
		dataConn.removeAllListeners();
		store.update((s): PeerStoreObj => ({ ...s, dataConn: null, connected: false }));
	});
	dataConn.on('error', (err) => {
		console.info('dataConn error', { err, type: err.type });
		if (err.type === 'connection-closed') {
			store.update((s): PeerStoreObj => ({ ...s, connected: false }));
		}
	});
};

const bindMediaConnectionToStore = (mediaConn: MediaConnectionType, store: PeerStore) => {
	store.update((s): PeerStoreObj => {
		s.mediaConn?.removeAllListeners();
		s.mediaConn?.close();
		return { ...s, mediaConn };
	});
	mediaConn.on('stream', (mediaStream) => {
		console.info('mediaConn got stream', mediaStream);
		store.update((s): PeerStoreObj => ({ ...s, mediaStream }));
	});
	mediaConn.on('close', () => {
		console.info('mediaConn close');
		store.update((s): PeerStoreObj => ({ ...s, mediaStream: null }));
	});
	mediaConn.on('error', (err) => {
		console.info('mediaConn error', err);
	});
};
