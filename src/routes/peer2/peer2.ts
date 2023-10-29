import {
	createPeerWithIceServers,
	emptyPeerStore,
	peer2Id,
	type PeerStore,
	type PeerStoreObj
} from '$lib/peers';
import { writable } from 'svelte/store';

export const lastMessage = writable<string>('');

export const createPeer2 = async (store: PeerStore) => {
	console.info('Creating new peer2');
	await createPeerWithIceServers(peer2Id, store);
};

export const peer2Store: PeerStore = writable<PeerStoreObj>(emptyPeerStore('peer2'), () => {
	console.info('new subscription for perStore2');
	createPeer2(peer2Store);

	return () => {
		console.info('No subscription  peer2');
	};
});
