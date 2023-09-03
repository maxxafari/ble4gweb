import { getIceServerList } from '$lib/iceServers';
import { AnswerCallFromPeer1, WaitForCallFromPeer1 } from '$lib/signalServer';
import Peer, { type SignalData } from 'simple-peer';
import { writable, get } from 'svelte/store';

type Peer2Store = {
	created: boolean;
	connected: boolean;
	videoStream: MediaStream | null;
	peer: Peer.Instance | null;
};

export const lastMessage = writable<string>('');

export const peer2Store = writable<Peer2Store>(
	{
		created: false,
		connected: false,
		videoStream: null,
		peer: null
	},
	() => {
		if (get(peer2Store).created) return;
		peer2Store.update((s) => ({ ...s, created: true }));
		createPeer2().then((peer) => {
			WaitForCallFromPeer1()
				.then((answer) => {
					peer.signal(answer);
				})
				.catch((e) => {
					console.error('Did not get a call from peer1', e);
					console.info('Waiting for call again...');
					// waitForCall();
				});
		});
		return () => {
			console.log('unsubscribed from peer2');
		};
	}
);

export const createPeer2 = async () => {
	const iceServers = await getIceServerList();

	const peer2 = new Peer({
		initiator: false,
		trickle: false,
		config: {
			iceServers
		}
	});

	peer2.on('error', (err) => console.log('error', err));

	// this will not trigger until we call peer2.signal(answer)
	peer2.on('signal', async (data: SignalData) => {
		// wen we have a call and have created an answer we send it back to peer1
		console.info('answering call from peer1', data);
		AnswerCallFromPeer1(data);
		// now we should get a connection
	});

	peer2.on('connect', () => {
		console.log('CONNECT');
		peer2Store.update((s) => ({ ...s, connected: true }));
		peer2?.send('Hi im connected now, ' + new Date().toISOString());
	});

	peer2.on('close', () => {
		console.log('CLOSE');
		peer2Store.update((s) => ({ ...s, connected: false }));
	});
	peer2.on('error', (err: any) => {
		console.error('error', err);
		peer2Store.update((s) => ({ ...s, connected: false }));
	});

	peer2.on('data', (d: string) => {
		console.log('GOT data:', d);
		lastMessage.set(d);
	});
	peer2.on('stream', (newStream) => {
		peer2Store.update((s) => ({ ...s, videoStream: newStream }));
	});
	return peer2;
};
