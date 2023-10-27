<!-- svelte component that controls the direction of a car with keyboard keys  -->
<script lang="ts">
	import { go } from '$lib/stearingStore';
	import GamePad from './GamePad.svelte';
	let ls = 0;
	let rs = 0;
	type lefRight = 'center' | 'left' | 'right';
	type forwardBackward = 'neutral' | 'forward' | 'reverse';

	function onKeyDown(e: KeyboardEvent) {
		if (e.repeat) return;
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				go.forward();
				break;
			case 'ArrowDown':
				e.preventDefault();
				go.reverse();
				break;
			case 'ArrowLeft':
				e.preventDefault();
				go.left();
				break;
			case 'ArrowRight':
				e.preventDefault();
				go.right();
				break;
			case ' ':
				e.preventDefault();
				go.stop();
				break;
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowUp':
			case 'ArrowDown':
				e.preventDefault();
				go.neutral();
				break;
			case 'ArrowLeft':
			case 'ArrowRight':
				e.preventDefault();
				go.center();
				break;
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:keydown={onKeyDown} on:keyup={onKeyUp}>
	<GamePad bind:ls bind:rs />
</div>

<style>
	div.arrow-buttons {
		/* 3x3 grid*/
		display: grid;
		grid-template: repeat(3, 1fr) / repeat(3, 1fr);
		grid-gap: 5px;
		width: 100%;
		max-width: 400px;
		margin: 0 auto;
	}

	button {
		border: 1ps solid black;
		border-radius: 5px;
		padding: 5px;
		margin: 5px;
		width: 30px;
		height: 30px;
		font-size: 1.5rem;
		font-weight: bold;
		background-color: #eee;
		text-align: center;
	}
	button.pressed {
		/* css pressed down button */
		transform: scale(0.9);
	}
</style>
