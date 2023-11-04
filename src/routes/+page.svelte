<script lang="ts">
	import ConnectBle from '$lib/components/ConnectBle.svelte';
	import ControlWithStore from '$lib/components/control/ControlWithStore.svelte';
	import Horn from '$lib/components/Horn.svelte';
	import Lights from '$lib/components/Lights.svelte';
	import Status from '$lib/components/Status.svelte';
	import { bindStearingToBle } from '$lib/transferToBle';
	import { preventScreenLock } from '$lib/utils';
	import { onMount } from 'svelte';

	preventScreenLock();
	onMount(() => {
		return bindStearingToBle();
		// how to do with multiple returns
	});
</script>

<svelte:head>
	<title>TEST BLE</title>
</svelte:head>
<div>
	<span>3.76</span>
	<ConnectBle />
	<Status isSender />
	<ControlWithStore />
	<Horn />
	<Lights />
</div>

<style>
</style>
