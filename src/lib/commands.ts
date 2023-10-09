import type { SearingStore } from '../routes/peer2/stearing';
import type { PeerStoreObj } from './peers';

export interface CommandList {
	led: {
		key: 'L';
		number: number;
		value: boolean;
	};
	servo: {
		key: 'S';
		number: number;
		value: number;
	};
	stear: {
		key: 'X';
		number: 0;
		value: SearingStore;
	};
}

export type Commands = ReturnType<typeof bindCommands>;

export interface SentCommand<T extends keyof CommandList> {
	key: CommandList[T]['key'];
	number: CommandList[T]['number'];
	value: CommandList[T]['value'];
}

interface CommandSent<T extends keyof CommandList> {
	(
		key: CommandList[T]['key'],
		number: CommandList[T]['number'],
		value: CommandList[T]['value']
	): void;
}

function notImplemented(...args: unknown[]) {
	console.error('command called before connections established', args);
}

export const nonImplementedCommands: Commands = {
	setLed: notImplemented,
	setServo: notImplemented,
	setStearing: notImplemented
};

export const bindCommands = (dataConn: NonNullable<PeerStoreObj['dataConn']>) => {
	const send: CommandSent<keyof CommandList> = (key, number, value) => {
		dataConn.send({
			key,
			number,
			value
		});
	};

	// type guard for CommandSent
	function setLed(ledNumber: number, on: boolean) {
		send('L', ledNumber, on);
	}
	function setServo(servoNumber: number, angle: number) {
		send('S', servoNumber, angle);
	}
	function setStearing(stearing: SearingStore) {
		send('X', 0, stearing);
	}
	return {
		setLed,
		setServo,
		setStearing
	};
};
