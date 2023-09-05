import { getIceServerList } from '$lib/iceServers';
import {
	AnswerCallFromPeer1,
	CallPeer2,
	WaitForCallAnswerFromPeer2,
	WaitForCallFromPeer1
} from '$lib/signalServer';
import Peer, { type SignalData } from 'simple-peer';
import { writable, get } from 'svelte/store';

type PeerStore = {
	created: boolean;
	connected: boolean;
	videoStream: MediaStream | null;
	peer: Peer.Instance | null;
};

export const lastMessage = writable<string>('');

export const peer1Store = writable<PeerStore>(
	{
		created: false,
		connected: false,
		videoStream: null,
		peer: null
	},
	() => {
		if (get(peer1Store).created) return;
		peer1Store.update((s) => ({ ...s, created: true }));
		// do we need a create peer here?
		return () => {
			console.log('unsubscribed from peer2');
		};
	}
);

export const createPeer1 = async () => {
	const iceServers = await getIceServerList();
	const peer1 = new Peer({
		initiator: true,
		trickle: false,
		config: {
			iceServers
		}
	});
	peer1.on('connect', () => {
		console.log('CONNECT');
		peer1Store.update((s) => ({ ...s, connected: true }));
		peer1?.send('Hi im connected now, ' + new Date().toISOString());
	});

	peer1.on('close', () => {
		console.log('CLOSE');
		peer1Store.update((s) => ({ ...s, connected: false }));
	});
	peer1.on('error', (err: any) => {
		console.error('error', err);
		peer1Store.update((s) => ({ ...s, connected: false }));
	});
	peer1.on('data', (d: string) => {
		console.log('GOT data:', d);
		lastMessage.set(d);
	});

	peer1.on('signal', async (data: SignalData) => {
		// TODO: call this on reload!
		// when we have a call from peer2, we open the connection
		console.info('Got my signal object form ice server');
		await CallPeer2(data);
		const answer = await WaitForCallAnswerFromPeer2();
		peer1?.signal(answer);

		// now we should get a connection
	});
};
