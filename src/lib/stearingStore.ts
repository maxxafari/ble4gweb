import type { Writable } from 'svelte/store';
import { get, writable } from 'svelte/store';
import type { DataConnection as DataConnectionType } from 'peerjs';

const storeKey = 'stear';

export type StearingStoreObj = {
	key: typeof storeKey;
	gear: 'F' | 'R' | 'N';
	speed: number;
	dir: 'L' | 'R' | 'C';
};
type StearingStore = Writable<StearingStoreObj>;

export const stearingStore: StearingStore = writable<StearingStoreObj>({
	key: storeKey,
	gear: 'N',
	speed: 50,
	dir: 'C'
});

const isStearingStoreObj = (data: unknown): data is StearingStoreObj => {
	if (typeof data === 'object' && data && 'key' in data && data.key === storeKey) {
		return true;
	}
	return false;
};

const goStop = () => {
	updSteer({ gear: 'N' });
};
const goLeft = () => {
	updSteer({ dir: 'L' });
};
const goRight = () => {
	updSteer({ dir: 'R' });
};
const goCenter = () => {
	updSteer({ dir: 'C' });
};
const goForward = () => {
	updSteer({ gear: 'F' });
};
const goReverse = () => {
	updSteer({ gear: 'R' });
};
const goNeutral = () => {
	updSteer({ gear: 'N' });
};

export const go = {
	left: goLeft,
	right: goRight,
	center: goCenter,
	forward: goForward,
	reverse: goReverse,
	neutral: goNeutral,
	stop: goStop
};
export function onKeyDown(e: KeyboardEvent) {
	if (e.repeat) return;
	switch (e.key) {
		case 'ArrowUp':
			e.preventDefault();
			go.forward();
			break;
		case 'ArrowDown':
			e.preventDefault();
			go.reverse();
			break;
		case 'ArrowLeft':
			e.preventDefault();
			go.left();
			break;
		case 'ArrowRight':
			e.preventDefault();
			go.right();
			break;
		case ' ':
			e.preventDefault();
			go.stop();
			break;
	}
}

export function onKeyUp(e: KeyboardEvent) {
	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowDown':
			e.preventDefault();
			go.neutral();
			break;
		case 'ArrowLeft':
		case 'ArrowRight':
			e.preventDefault();
			go.center();
			break;
	}
}

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
