<script lang="ts">
	import { btnStore, btnPress } from '$lib/buttonStore';
	import { onMount } from 'svelte';
	btnPress('lights', true);
</script>

<button
	on:click={() => {
		btnPress('lights', true);
	}}>Turn Lights {$btnStore.lights ? 'OFF' : 'ON'}</button
>
