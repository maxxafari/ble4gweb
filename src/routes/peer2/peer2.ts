import { bindCommands } from '$lib/commands';
import { createPeerWithIceServers, emptyPeerStore, peer2Id, type PeerStore } from '$lib/peers';
import { writable, get, type Writable } from 'svelte/store';

export const lastMessage = writable<string>('');

export const createPeer2 = async (store: Writable<PeerStore>) => {
	console.info('Creating new peer2');
	await createPeerWithIceServers(peer2Id, store);
};

export const peer2Store = writable<PeerStore>(emptyPeerStore, () => {
	console.info('new subscription for perStore2');
	createPeer2(peer2Store);

	return () => {
		console.info('No subscription  peer2');
	};
});
peer2Store.subscribe((s) => {
	if (s.dataConn) {
		console.error('not implemented');
		// bindCommands(s.dataConn);
		// TODO : pass commands to page... derived store ? add actions to store ?
	}
});
