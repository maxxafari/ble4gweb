import { writable, type Writable } from 'svelte/store';
import type { DataConnection as DataConnectionType } from 'peerjs';

const storeKey = 'btn';

export type BtnStore = {
	key: typeof storeKey;
	horn: boolean;
	lights: boolean;
	speedMode: boolean;
	maxSpeed: number;
};

export const btnStore: Writable<BtnStore> = writable({
	key: storeKey,
	horn: false,
	lights: false,
	speedMode: false,
	maxSpeed: 15
});
let timer: NodeJS.Timeout;
type CB = () => void;

const debounce = (func: CB) => {
	clearTimeout(timer);
	timer = setTimeout(() => {
		func();
	}, 100);
};

export const updStore = (newData: Partial<BtnStore>) => {
	btnStore.update((oldData) => ({ ...oldData, ...newData }));
};

const isDataStoreObj = (data: unknown): data is BtnStore => {
	if (typeof data === 'object' && data && 'key' in data && data.key === storeKey) {
		return true;
	}
	return false;
};

// use in peer 1
export const bindBtnStoreToConnDownStream = (conn: DataConnectionType) => {
	console.log('bindStatusStoreToConnDownStream');
	conn.on('data', (data) => {
		if (isDataStoreObj(data)) {
			updStore(data);
		}
	});
};
// use in peer 2
export const bindBtnStoreToConnUpStream = (conn: DataConnectionType) => {
	console.log('bindStatusStoreToConnUpStream');
	btnStore.subscribe((data) => {
		debounce(() => {
			conn.send(data);
		});
	});
};
/* call when a button is pressed that should be synced to other device.
 * toggle should be true for example lights and false for horn
 */
export const btnPress = (btnName: keyof BtnStore, toggle: boolean) => {
	console.log('btnPress!');
	debounce(() => {
		btnStore.update((oldData) => ({ ...oldData, [btnName]: !oldData[btnName] }));
		if (!toggle) {
			setTimeout(() => {
				btnStore.update((oldData) => ({ ...oldData, [btnName]: false }));
			}, 100);
		}
	});
};
