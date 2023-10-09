import { writable, type Writable } from 'svelte/store';
import type { DataConnection as DataConnectionType } from 'peerjs';

const storeKey = 'status';

export type StatStore = {
	gps: { lat: number | null; lng: number | null; alt: number | null; accuracy: number | null };
	compass: number | null;
	phoneBattery: number;
	phoneConnection: {
		effectiveType: '';
		rtt: number;
		downlink: number;
	};
	bleBattery: number;
	bleConnected: false;
	bleSignal: number;
};

export const statusStore: Writable<StatStore> = writable({
	gps: { lat: 0, lng: 0, alt: 0, accuracy: -1 },
	compass: null,
	phoneBattery: -1,
	phoneConnection: {
		effectiveType: '',
		rtt: -1,
		downlink: -1
	},
	bleBattery: -1,
	bleConnected: false,
	bleSignal: -1
});
let timer: NodeJS.Timeout;
type CB = () => void;

const debounce = (func: CB) => {
	clearTimeout(timer);
	timer = setTimeout(() => {
		func();
	}, 500);
};

export const updStat = (newData: Partial<StatStore>) => {
	statusStore.update((oldData) => ({ ...oldData, ...newData }));
};

const isDataStoreObj = (data: unknown): data is StatStore => {
	if (typeof data === 'object' && data && 'key' in data && data.key === storeKey) {
		return true;
	}
	return false;
};

export const bindStatusStoreToConnDownStream = (conn: DataConnectionType) => {
	conn.on('data', (data) => {
		if (isDataStoreObj(data)) {
			updStat(data);
		}
	});
};

export const bindStatusStoreToConnUpStream = (conn: DataConnectionType) => {
	statusStore.subscribe((data) => {
		debounce(() => {
			conn.send(data);
		});
	});
};
