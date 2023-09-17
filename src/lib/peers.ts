import { Peer } from 'peerjs';
import type {
	Peer as PeerType,
	DataConnection as DataConnectionType,
	MediaConnection as MediaConnectionType
} from 'peerjs';
import { getIceServerList } from './iceServers';
import { get, type Writable } from 'svelte/store';

export const peer1Id = 'ble-controller-p1';
export const peer2Id = 'ble-controller-p2';

export type PeerStore = {
	created: boolean;
	connected: boolean;
	open: boolean;
	mediaStream: MediaStream | null;
	peer: PeerType | null;
	dataConn: DataConnectionType | null;
	mediaConn: MediaConnectionType | null;
};

export const emptyPeerStore: PeerStore = {
	created: false,
	connected: false,
	mediaStream: null,
	open: false,
	peer: null,
	dataConn: null,
	mediaConn: null
};

export const clearStore = (store: Writable<PeerStore>) => {
	console.log('clearing store');
	const { peer, dataConn, mediaConn, mediaStream } = get(store);
	if (dataConn) dataConn.close();
	if (mediaConn) mediaConn.close();
	if (mediaStream) mediaStream.getTracks().forEach((t) => t.stop());
	if (peer) peer.destroy();
	store.set(emptyPeerStore);
};
export const createPeerWithIceServers = async (id: string, store: Writable<PeerStore>) => {
	//clearStore(store);
	const iceServers = await getIceServerList();
	const peer = new Peer(id, {
		config: {
			iceServers: iceServers,
			debug: 3
		}
	});
	bindPeerToStore(peer, store);
	return peer;
};

const bindPeerToStore = (peer: PeerType, store: Writable<PeerStore>) => {
	store.update((s): PeerStore => {
		s.peer?.removeAllListeners();
		s.peer?.destroy();
		return { ...s, peer: peer };
	});
	peer.on('open', () => {
		console.info('peer open, connected to server');
		store.update((s): PeerStore => ({ ...s, open: true }));
	});
	peer.on('connection', (conn) => {
		console.info('peer got connection');
		bindDataConnectionToStore(conn, store);
	});
	peer.on('call', (mediaConn) => {
		console.info('answering call');
		bindMediaConnectionToStore(mediaConn, store);
		mediaConn.answer();
	});
	console.info('waiting for call');
	peer.on('close', () => {
		console.info('peer closed,  ');
		// peer.reconnect();
	});
	peer.on('disconnected', () => {
		console.info('peer disconnected,  ');
		// peer.reconnect();
	});
	peer.on('error', (err) => {
		console.error('peer error type', err.type);
		console.error('peer error', { err });
	});
};

export const bindDataConnectionToStore = (
	dataConn: DataConnectionType,
	store: Writable<PeerStore>
) => {
	store.update((s): PeerStore => {
		s.dataConn?.removeAllListeners();
		s.dataConn?.close();

		return { ...s, dataConn };
	});

	dataConn.on('data', (data) => {
		console.info('dataConn gotData', data);
	});
	dataConn.on('open', () => {
		console.info('dataConn open!');
		store.update((s): PeerStore => ({ ...s, connected: true }));
		dataConn.send('hello!');
	});
	dataConn.on('close', () => {
		console.info('dataConn closed');
		dataConn.removeAllListeners();
		store.update((s): PeerStore => ({ ...s, dataConn: null, connected: false }));
	});
	dataConn.on('error', (err) => {
		console.info('dataConn error', { err, type: err.type });
		if (err.type === 'connection-closed') {
			store.update((s): PeerStore => ({ ...s, connected: false }));
		}
	});
};

const bindMediaConnectionToStore = (mediaConn: MediaConnectionType, store: Writable<PeerStore>) => {
	store.update((s): PeerStore => {
		s.mediaConn?.removeAllListeners();
		s.mediaConn?.close();
		return { ...s, mediaConn };
	});
	mediaConn.on('stream', (mediaStream) => {
		console.info('mediaConn got stream', mediaStream);
		store.update((s): PeerStore => ({ ...s, mediaStream }));
	});
	mediaConn.on('close', () => {
		console.info('mediaConn close');
		store.update((s): PeerStore => ({ ...s, mediaStream: null }));
	});
	mediaConn.on('error', (err) => {
		console.info('mediaConn error', err);
	});
};
