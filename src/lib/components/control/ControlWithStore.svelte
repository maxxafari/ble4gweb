<!-- svelte component that controls the direction of a car with keyboard keys  -->
<script lang="ts">
	import { updSteer } from '$lib/stearingStore';
	import GamePad from './GamePad.svelte';
	let ls = 0;
	let rs = 0;
	let lsFilter = 0;
	let rsFilter = 0;
	function filterMinimumInput(lsRaw: number, rsRaw: number) {
		if (lsRaw < 11 && lsRaw > -11) lsFilter = 0;
		else lsFilter = lsRaw;
		if (rsRaw < 11 && rsRaw > -11) rsFilter = 0;
		else rsFilter = rsRaw;

		updSteer({ lm: lsFilter, rm: rsFilter });
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
