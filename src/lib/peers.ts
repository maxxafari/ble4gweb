import { Peer } from 'peerjs';
import type {
	Peer as PeerType,
	DataConnection as DataConnectionType,
	MediaConnection as MediaConnectionType
} from 'peerjs';
import { getIceServerList } from './iceServers';
import type { Writable } from 'svelte/store';

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

export const createPeerWithIceServers = async (id: string, store: Writable<PeerStore>) => {
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
	peer.on('open', () => {
		console.info('peer open, connected to server');
		store.update((s): PeerStore => ({ ...s, open: true }));
	});
	peer.on('connection', (conn) => {
		console.info('peer got connection');
		store.update((s): PeerStore => ({ ...s, connected: true }));
		bindDataConnectionToStore(conn, store);
	});
	peer.on('call', (mediaConn) => {
		console.info('answering call');
		bindMediaConnectionToStore(mediaConn, store);
		mediaConn.answer();
	});
	console.info('waiting for call');
	peer.on('close', () => {
		console.info('peer closed, reconnecting ');
		store.update((s): PeerStore => ({ ...s, connected: false }));
		peer.reconnect();
	});
	peer.on('disconnected', () => {
		console.info('peer disconnected, reconnecting ');
		store.update((s): PeerStore => ({ ...s, connected: false }));
		peer.reconnect();
	});
	peer.on('error', (err) => {
		console.info('peer error', err);
	});
	store.update((s): PeerStore => ({ ...s, peer: peer }));
};

export const bindDataConnectionToStore = (
	dataConn: DataConnectionType,
	store: Writable<PeerStore>
) => {
	dataConn.on('data', (data) => {
		console.info('dataConn gotData', data);
	});
	dataConn.on('open', () => {
		console.info('dataConn open!');
		dataConn.send('hello!');
	});
	dataConn.on('close', () => {
		console.info('dataConn closed');
		store.update((s): PeerStore => ({ ...s, dataConn: null }));
	});
	dataConn.on('error', (err) => {
		console.info('dataConn error', err);
	});
	store.update((s): PeerStore => ({ ...s, dataConn }));
};

const bindMediaConnectionToStore = (mediaConn: MediaConnectionType, store: Writable<PeerStore>) => {
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
	store.update((s): PeerStore => ({ ...s, mediaConn }));
};
