<script lang="ts">
	import { btnStore } from '$lib/buttonStore';
	import { onMount } from 'svelte';

	let audio: HTMLAudioElement;
	export function soundHorn() {
		audio.play();
	}
	onMount(() => {
		return btnStore.subscribe((s) => {
			if (s.horn) {
				soundHorn();
			}
		});
	});
</script>

<button on:click={soundHorn}>Horn</button>

<audio src="/horn.wav" bind:this={audio} />
