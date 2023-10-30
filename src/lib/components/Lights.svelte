<script lang="ts">
	import { btnStore, btnPress } from '$lib/buttonStore';
</script>

<button
	on:click={() => {
		btnPress('lights', true);
	}}>Turn Lights {$btnStore.lights ? 'OFF' : 'ON'}</button
>
