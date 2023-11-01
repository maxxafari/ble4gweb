<!-- svelte component that controls the direction of a car with keyboard keys  -->
<script lang="ts">
	import { updSteer } from '$lib/stearingStore';
	import GamePad from './GamePad.svelte';
	const maxSpeed = 254;
	const controllerDeadPoint = 11;
	let ls = 0;
	let rs = 0;
	let lsFilter = 0;
	let rsFilter = 0;
	function filterMinimumInput(lsRaw: number, rsRaw: number) {
		// filter controller dead point
		if (lsRaw < controllerDeadPoint && lsRaw > -controllerDeadPoint) lsFilter = 0;
		else lsFilter = lsRaw;
		if (rsRaw < controllerDeadPoint && rsRaw > -controllerDeadPoint) rsFilter = 0;
		else rsFilter = rsRaw;
		// add stearing correction to motor speed
		let lSpeed = lsFilter;
		let rSpeed = lsFilter;
		lSpeed = lSpeed + rsFilter;
		rSpeed = rSpeed - rsFilter;
		// limit max speed on motors speed + stearing can overflow max speed
		if (lSpeed > maxSpeed) lSpeed = maxSpeed;
		if (rSpeed > maxSpeed) rSpeed = maxSpeed;

		updSteer({ lm: lSpeed, rm: rSpeed });
	}
	$: filterMinimumInput(ls, rs);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrap">
	<div class="filtered"><span>{lsFilter}</span><span>{rsFilter}</span></div>
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
