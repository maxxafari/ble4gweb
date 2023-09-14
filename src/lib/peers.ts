import { Peer } from 'peerjs';
import type { Peer as PeerType, DataConnection as DataConnectionType } from 'peerjs';
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
			iceServers: iceServers
		}
	});
	peer.on('error', (err) => {
		console.log('peer error', err);
	});
	return peer;
};
