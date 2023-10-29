import type { StearingStoreObj } from './stearingStore';
import { createBLEService, createBleDevice } from './BLEServiceBuilder';

const battery = createBLEService<string>({
	name: 'Battery',
	serviceId: 'battery_service',
	characteristicId: 'battery_level',
	isNotifiable: true,
	readParser: (dataView) => dataView.getUint8(0).toString()
});

const leds = createBLEService<string>({
	name: 'Leds',
	serviceId: 'a3941db0-a97c-4cf1-943f-a25ff9ba40cd',
	characteristicId: '5b8c0ab6-a058-4684-b2b6-4a0a692e2d45',
	isNotifiable: false,
	readParser: (dataView) => {
		console.log('dataView leds', dataView);

		return dataView.getInt8(0) + '' + dataView.getInt8(1);
	},
	setParser: (data: string | StearingStoreObj) => {
		if (typeof data === 'string') {
			const [blue, red] = data.split('').map((d) => parseInt(d));
			return new Uint8Array([blue, red]);
		} else {
			console.log('unhandled data setParser', data);
			return new Uint8Array([0, 0]);
		}
	}
});

const servo = createBLEService<number>({
	name: 'Servo',
	serviceId: '847a27cd-ccf0-4f7e-8cb4-d5fe53df2d60',
	characteristicId: '7c1b818b-dff0-4514-8bcf-f0ad8c79fad9',
	isNotifiable: false,
	readParser: (dataView) => dataView.getUint8(0),
	setParser: (degrees: number, speed?: number) => {
		const servoValues = [degrees, speed || 90]; // i guess 90 is mid point
		const uint8 = new Uint8Array(servoValues);
		return uint8.buffer;
	}
});

const ble = createBleDevice([leds, servo, battery]);

export const device = {
	...ble,
	leds,
	servo,
	battery
};
