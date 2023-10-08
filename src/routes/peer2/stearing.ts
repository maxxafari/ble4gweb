import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export type SearingStore = {
	gear: 'F' | 'R' | 'N';
	speed: number;
	direction: 'L' | 'R' | 'C';
};
export const searingStore: Writable<SearingStore> = writable({
	gear: 'N',
	speed: 50,
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
	if (e.repeat) return;
	switch (e.key) {
		case 'ArrowUp':
			go.forward();
			break;
		case 'ArrowDown':
			go.reverse();
			break;
		case 'ArrowLeft':
			go.left();
			break;
		case 'ArrowRight':
			go.right();
			break;
		case ' ':
			go.stop();
			break;
	}
}

export function onKeyUp(e: KeyboardEvent) {
	switch (e.key) {
		case 'ArrowUp':
		case 'ArrowDown':
			go.neutral();
			break;
		case 'ArrowLeft':
		case 'ArrowRight':
			go.center();
			break;
	}
}
