import type { PeerStore } from './peers';

// commands that can be forwarded to BLE device over dataConn

type Commands = 'setSpeed' | 'setSteering';

export const bindCommands = (dataConn: PeerStore['dataConn']) => {
	const send = (cmd: Commands, value: number | undefined) => {
		dataConn?.send({ cmd, value });
	};

	return {
		setSpeed: (speed: number) => {
			send('setSpeed', speed);
		},
		setSteering: (angle: number) => {
			send('setSteering', angle);
		}
	};
};
