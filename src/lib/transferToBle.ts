import { device } from '$lib/device';
import { stearingStore } from '$lib/stearingStore';

let lastCommandSent = new Date().getTime();
let timeOutId: NodeJS.Timeout | null = null;
let latestValue: ArrayBufferLike;

const throttleMs = 90;

const throttleSendCommand = (valueToSend: ArrayBufferLike) => {
	latestValue = valueToSend;
	const now = new Date().getTime();

	if (now > lastCommandSent + throttleMs) {
		// fist command or long since last command
		lastCommandSent = now;
		device.leds.setValRaw(latestValue);
	} else if (!timeOutId) {
		// second command
		timeOutId = setTimeout(() => {
			device.leds.setValRaw(latestValue);
			lastCommandSent = new Date().getTime();
			timeOutId = null;
		}, throttleMs);
	} else {
		// third, forth ...
		// just update latestValue = valueToSend;
	}
};

export function bindStearingToBle() {
	return stearingStore.subscribe((stearing) => {
		// if (stearingStoreUnsubscribe) stearingStoreUnsubscribe(); this doent work...
		if (!device.isConnected()) {
			console.warn('command not sent, BLE not connected', stearing);
			return;
		}
		const { lm, rm } = stearing;
		const uint8array = new TextEncoder().encode('X' + 'L' + 'R' + 'l' + 'r'); // placehoders fol values
		uint8array[1] = Math.abs(lm); // left speed
		uint8array[2] = Math.abs(rm); // right speed
		uint8array[3] = lm < 0 ? 1 : 0; // left direction
		uint8array[4] = rm < 0 ? 1 : 0; // right direction
		throttleSendCommand(uint8array.buffer);
		// before throttle device.leds.setValRaw(uint8array.buffer); // its still called leds but will fix all stearing stuff
		return;
	});
}
