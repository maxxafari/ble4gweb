import { getIceServerList } from '$lib/iceServers';
import { bindConnection, createPeerWithIceServers, peer2Id, type PeerStore } from '$lib/peers';
import { Peer } from 'peerjs';
import type { Peer as PeerType } from 'peerjs';
import { writable, get } from 'svelte/store';

export const lastMessage = writable<string>('');

export const createPeer2 = async () => {
	console.info('Creating new peer2');
	const peer = await createPeerWithIceServers(peer2Id);
	bindPeer2(peer);
	peer.on('open', () => {
		console.info('peer is open');
	});
	peer.on('connection', (conn) => {
		bindConnection(conn);
	});
	peer2Store.update((s) => ({ ...s, peer: peer }));
	return peer;
};

export const peer2Store = writable<PeerStore>(
	{
		created: false,
		connected: false,
		videoStream: null,
		peer: null,
		conn: null
	},
	() => {
		if (get(peer2Store).created) return;
		peer2Store.update((s) => ({ ...s, created: true }));
		createPeer2().then((peer) => {
			peer2Store.update((s) => ({ ...s, peer: peer }));
		});
		return () => {
			console.log('unsubscribed from peer2');
		};
	}
);

export const bindPeer2 = async (peer: PeerType) => {
	//const iceServers = await getIceServerList();
	console.info('Waiting for call from p1...');
	peer.on('call', (mediaConn) => {
		// bindConnection(conn);
		console.log('peer2 received call (conn)');
		mediaConn.answer();
		mediaConn.dataChannel.send('hi from peer2');
	});
	console.info('Waiting for call from p1...');
	peer.on('call', (mediaConn) => {
		// bindConnection(conn);
		console.log('peer2 received call (conn)');
		mediaConn.answer();
		mediaConn.dataChannel.send('hi from peer2');
	});
};
