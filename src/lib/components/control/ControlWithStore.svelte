<!-- svelte component that controls the direction of a car with keyboard keys  -->
<script lang="ts">
	import { updSteer } from '$lib/stearingStore';
	import GamePad from './GamePad.svelte';
	let ls = 0;
	let rs = 0;

	$: updSteer({ lm: ls, rm: rs });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div>
	<!-- <div>{ls} || {rs}</div> -->
	<GamePad bind:ls bind:rs />
</div>

<style>
</style>
