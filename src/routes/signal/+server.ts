import { json } from '@sveltejs/kit';
import type { SignalData } from 'simple-peer';
// import * as database from '$lib/server/database.js';
interface SignalServerResponse {
	offer: SignalData | '';
	answer: SignalData | '';
}

let database: SignalServerResponse = {
	offer: '',
	answer: ''
};
export async function POST({ request, cookies }) {
	const { offer, answer } = await request.json();

	// reset answer when creating new offer and vice versa
	if (answer) database = { answer, offer: '' };
	if (offer) database = { answer: '', offer };

	return json({ done: true }, { status: 201 });
}

export async function GET({ request, cookies }) {
	// const url = new URL(request.url);
	// url.searchParams.get('signalCall');
	// const userid = cookies.get('userid');
	return json(database, { status: 200 });
}
