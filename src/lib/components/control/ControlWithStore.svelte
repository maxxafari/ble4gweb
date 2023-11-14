<!-- svelte component that controls the direction of a car with keyboard keys  -->
<script lang="ts">
	// import { btnStore } from '$lib/buttonStore';
	import { updSteer, stearingStore } from '$lib/stearingStore';
	import GamePad from './GamePad.svelte';

	const absoluteMaxSpeed = 254;

	let ls = 0;
	let rs = 0;
	let speedMultiplier = 1;
	function mapSpeedAndDirection(ls: number, rs: number) {
		// add stearing correction to motor speed
		let lSpeed = ls + rs;
		let rSpeed = ls - rs;
		// TODO fix backward stearing
		if (lSpeed > absoluteMaxSpeed) lSpeed = absoluteMaxSpeed;
		if (rSpeed > absoluteMaxSpeed) rSpeed = absoluteMaxSpeed;
		if (lSpeed < -absoluteMaxSpeed) lSpeed = -absoluteMaxSpeed;
		if (rSpeed < -absoluteMaxSpeed) rSpeed = -absoluteMaxSpeed;

		updSteer({ lm: lSpeed, rm: rSpeed });
	}
	$: mapSpeedAndDirection(ls, rs);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrap">
	<div class="filtered"><span>{$stearingStore.lm}</span><span>{$stearingStore.rm}</span></div>
	<GamePad bind:ls bind:rs bind:speedMultiplier />
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
