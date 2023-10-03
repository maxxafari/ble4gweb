import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export type SearingStore = {
	gear: 'F' | 'R' | 'N';
	speed: number;
	direction: 'L' | 'R' | 'C';
};
export const searingStore: Writable<SearingStore> = writable({
	gear: 'N',
	speed: 0,
	direction: 'C'
});

const goStop = () => {
	searingStore.update((s) => ({ ...s, speed: 0, gear: 'N' }));
};
const goLeft = () => {
	searingStore.update((s) => ({ ...s, direction: 'L' }));
};
const goRight = () => {
	searingStore.update((s) => ({ ...s, direction: 'R' }));
};
const goCenter = () => {
	searingStore.update((s) => ({ ...s, direction: 'C' }));
};
const goForward = () => {
	searingStore.update((s) => ({ ...s, gear: 'F' }));
};
const goReverse = () => {
	searingStore.update((s) => ({ ...s, gear: 'R' }));
};
const goNeutral = () => {
	searingStore.update((s) => ({ ...s, gear: 'N' }));
};

export const go = {
	left: goLeft,
	right: goRight,
	center: goCenter,
	forward: goForward,
	reverse: goReverse,
	neutral: goNeutral,
	stop: goStop
};

export function onKeyDown(e: KeyboardEvent) {
	switch (e.keyCode) {
		case 38: // up
			go.forward();
			break;
		case 40: // down
			go.reverse();
			break;
		case 37: // left
			go.left();
			break;
		case 39: // right
			go.right();
			break;
		// space
		case 32: // space
			go.stop();
			break;
	}
}

export function onKeyUp(e: KeyboardEvent) {
	switch (e.keyCode) {
		case 38: // up
			go.neutral();
			break;
		case 40: // down
			go.neutral();
			break;
		case 37: // left
			go.center();
			break;
		case 39: // right
			go.center();
			break;
	}
}
