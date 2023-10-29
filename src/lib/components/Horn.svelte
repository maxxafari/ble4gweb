<script lang="ts">
	import { onMount } from 'svelte';

	let audio: HTMLAudioElement;
	export function soundHorn() {
		audio.play();
	}
</script>

<button on:click={soundHorn}>Horn</button>

<audio src="/horn.wav" bind:this={audio} />
