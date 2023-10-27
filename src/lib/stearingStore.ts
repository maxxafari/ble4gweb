import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import type { DataConnection as DataConnectionType } from 'peerjs';

const storeKey = 'stear';

export type StearingStoreObj = {
	key: typeof storeKey;
	lm: number;
	rm: number;
};
type StearingStore = Writable<StearingStoreObj>;

export const stearingStore: StearingStore = writable<StearingStoreObj>({
	key: storeKey,
	lm: 0,
	rm: 0
});

const isStearingStoreObj = (data: unknown): data is StearingStoreObj => {
	if (typeof data === 'object' && data && 'key' in data && data.key === storeKey) {
		return true;
	}
	return false;
};

export const updSteer = (newData: Partial<StearingStoreObj>) => {
	stearingStore.update((oldData) => ({ ...oldData, ...newData }));
};

export const bindStearingStoreToConnDownStream = (conn: DataConnectionType) => {
	console.log('bindStearingStoreToConnDownStream');
	conn.on('data', (data) => {
		if (isStearingStoreObj(data)) {
			data;
			updSteer(data);
		}
	});
};

export const bindStearingStoreToConnUpStream = (conn: DataConnectionType) => {
	console.log('bindStearingStoreToConnDownStream');
	stearingStore.subscribe((data) => {
		// debounce(() => {
		conn.send(data);
		// });
	});
	// send initial data
	const currentState = get(stearingStore);
	conn.send(currentState);
};
