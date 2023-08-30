import type { SignalData } from 'simple-peer';

const signalServer = 'https://connect.inboxgo.org/inbox';

interface User {
	username: string;
	pass: string;
}

const caller: User = {
	username: 'web-ble-control-caller',
	pass: 'not-a-secret-at-all'
};
const responder: User = {
	username: 'responder3',
	pass: 'notasecretatallalso3'
};

async function receive(username: string, password: string): Promise<SignalData> {
	const headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(username + ':' + password));
	const response = await fetch(`${signalServer}`, {
		headers,
		method: 'GET',
		cache: 'no-cache'
	});

	try {
		const data = await response.json();
		console.info('Received message from signal server:', data);
		return data;
	} catch (e) {
		throw new Error('Failed to receive message from signal server');
	}
}

async function signalSend(from: string, password: string, to: string, data: SignalData) {
	const response = await fetch(`${signalServer}?to=${to}`, {
		method: 'POST',
		mode: 'no-cors',
		cache: 'no-cache',
		headers: new Headers({ Authorization: 'Basic ' + window.btoa(from + ':' + password) }),
		body: JSON.stringify(data)
	});
	console.info('Sent message to signal server:', data);
}

export async function CallPeer2(offer: SignalData): Promise<SignalData> {
	return new Promise((resolve, reject) => {
		// create inbox first by calling receive
		receive(caller.username, caller.pass)
			.then((data: SignalData) => {
				console.info('Received message from signal server:', data);
				resolve(data);
			})
			.catch((e: Error) => {
				reject(e);
			});
		// then send offer to responder
		signalSend(caller.username, caller.pass, responder.username, offer);
	});
}

export const WaitForCallFromPeer1 = async (): Promise<SignalData> => {
	return await receive(responder.username, responder.pass);
};

export const AnswerCallFromPeer1 = async (answer: SignalData): Promise<void> => {
	signalSend(responder.username, responder.pass, caller.username, answer);
};
