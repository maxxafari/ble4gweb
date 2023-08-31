import type { SignalData } from 'simple-peer';

const signalServer = '/ble4gweb/signal';

interface SignalServerResponseRequest {
	offer: SignalData | '';
	answer: SignalData | '';
}

async function receive(): Promise<SignalServerResponseRequest> {
	const response = await fetch(`${signalServer}`, {
		method: 'GET',
		cache: 'no-cache'
	});

	try {
		const data = await response.json();
		return data;
	} catch (e) {
		throw new Error('Failed to receive message from signal server');
	}
}

async function waitSeconds(seconds: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, seconds * 1000);
	});
}

async function signalSend(data: SignalServerResponseRequest) {
	const response = await fetch(`${signalServer}`, {
		method: 'POST',
		cache: 'no-cache',
		body: JSON.stringify(data)
	});
}

export async function CallPeer2(offer: SignalData): Promise<void> {
	await signalSend({ offer, answer: '' });
}

export const WaitForCallFromPeer1 = async (): Promise<SignalData> => {
	let data: SignalServerResponseRequest = { offer: '', answer: '' };
	let resolve: (value: SignalData) => void;
	const p = new Promise<SignalData>((r) => {
		resolve = (value) => r(value);
	});

	while (!data.offer) {
		await waitSeconds(2);
		data = await receive();
		console.info('Received message from signal server:', data);
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (data.offer && resolve!) resolve!(data.offer);
	}
	return p;
};

export const WaitForCallAnswerFromPeer2 = async (): Promise<SignalData> => {
	let data: SignalServerResponseRequest = { offer: '', answer: '' };
	let resolve: (value: SignalData) => void;
	const p = new Promise<SignalData>((r) => {
		resolve = (value) => r(value);
	});

	while (!data.answer) {
		await waitSeconds(2);
		data = await receive();
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		if (data.answer && resolve!) resolve!(data.answer);
		else console.info('No answer yet...', data);
	}
	return p;
};

export const AnswerCallFromPeer1 = async (answer: SignalData): Promise<void> => {
	return await signalSend({ offer: '', answer });
};
