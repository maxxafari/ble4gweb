import { getIceServerList } from '$lib/iceServers';
import { createPeerWithIceServers, peer2Id, type PeerStore } from '$lib/peers';
import { Peer } from 'peerjs';
import type { DataConnection } from 'peerjs';
import type { Peer as PeerType } from 'peerjs';
import { writable, get } from 'svelte/store';

export const lastMessage = writable<string>('');

export const createPeer2 = async () => {
	console.info('Creating new peer2');
	const peer = await createPeerWithIceServers(peer2Id);

	//todo:  add to store
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
			bindPeer2(peer);
		});
		return () => {
			console.log('unsubscribed from peer2');
		};
	}
);

export const bindPeer2 = async (peer: PeerType) => {
	//const iceServers = await getIceServerList();
	console.info('Waiting for call from p1...');
	peer.on('call', function (call) {
		console.log('peer2 received call');
		// Answer the call, providing our mediaStream
		call.answer();
		call.dataChannel.send('hi from peer2');
	});
};
