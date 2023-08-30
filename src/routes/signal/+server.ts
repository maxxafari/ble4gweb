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

	// const userid = cookies.get('userid');
	if (offer) database = { ...database, offer };
	if (answer) database = { ...database, answer };

	return json({ done: true }, { status: 201 });
}

export async function GET({ request, cookies }) {
	// const url = new URL(request.url);
	// url.searchParams.get('signalCall');
	// const userid = cookies.get('userid');
	return json(database, { status: 200 });
}
