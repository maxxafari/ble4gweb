import { Peer } from 'peerjs';
import type {
	Peer as PeerType,
	DataConnection as DataConnectionType,
	MediaConnection as MediaConnectionType
} from 'peerjs';
import { getIceServerList } from './iceServers';

export type PeerStore = {
	created: boolean;
	connected: boolean;
	videoStream: MediaStream | null;
	peer: PeerType | null;
	conn: DataConnectionType | null;
};

export const peer1Id = 'ble-controller-p1';
export const peer2Id = 'ble-controller-p2';

export const createPeerWithIceServers = async (id: string) => {
	const iceServers = await getIceServerList();
	const peer = new Peer(id, {
		config: {
			iceServers: iceServers,
			debug: 3
		}
	});
	peer.on('error', (err) => {
		console.log('peer error', err);
	});
	return peer;
};

export const bindConnection = (conn: DataConnectionType) => {
	conn.on('data', (data) => {
		console.log('data', data);
	});
	conn.on('error', (err) => {
		console.log('conn error', err);
	});
	conn.on('open', () => {
		console.log('conn open!');
		conn.send('hello!');
	});
};
