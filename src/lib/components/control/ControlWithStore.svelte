<!-- svelte component that controls the direction of a car with keyboard keys  -->
<script lang="ts">
	import { updSteer, stearingStore } from '$lib/stearingStore';
	import GamePad from './GamePad.svelte';
	const maxSpeed = 254;
	let ls = 0;
	let rs = 0;
	function mapSpeedAndDirection(ls: number, rs: number) {
		// add stearing correction to motor speed
		let lSpeed = ls + rs;
		let rSpeed = ls - rs;
		if (lSpeed > maxSpeed) lSpeed = maxSpeed;
		if (rSpeed > maxSpeed) rSpeed = maxSpeed;
		if (lSpeed < -maxSpeed) lSpeed = -maxSpeed;
		if (rSpeed < -maxSpeed) rSpeed = -maxSpeed;

		updSteer({ lm: lSpeed, rm: rSpeed });
	}
	$: mapSpeedAndDirection(ls, rs);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrap">
	<div class="filtered"><span>{$stearingStore.lm}</span><span>{$stearingStore.rm}</span></div>
	<GamePad bind:ls bind:rs />
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.filtered {
		display: flex;
		width: 100%;
		height: 30px;
		justify-content: space-around;
	}
</style>
