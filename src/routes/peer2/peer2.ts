import { createPeerWithIceServers, emptyPeerStore, peer2Id, type PeerStore } from '$lib/peers';
import { writable, get, type Writable } from 'svelte/store';

export const lastMessage = writable<string>('');

export const createPeer2 = async (store: Writable<PeerStore>) => {
	console.info('Creating new peer2');
	createPeerWithIceServers(peer2Id, store);
};

export const peer2Store = writable<PeerStore>(emptyPeerStore, () => {
	console.info('new subscription for perStore2');
	createPeer2(peer2Store);
	return () => {
		console.info('destroy  peer2');
		get(peer2Store).peer?.destroy();
		//createPeer2(peer2Store);
	};
});
