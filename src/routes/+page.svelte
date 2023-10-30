<script lang="ts">
	import ConnectBle from '$lib/components/ConnectBle.svelte';
	import ControlWithStore from '$lib/components/control/ControlWithStore.svelte';
	import Horn from '$lib/components/Horn.svelte';
	import Lights from '$lib/components/Lights.svelte';
	import Status from '$lib/components/Status.svelte';
	import { bindStearingToBle } from '$lib/transferToBle';
	import { preventScreenLock } from '$lib/utils';

	preventScreenLock();
	bindStearingToBle();
</script>

<svelte:head>
	<title>TEST BLE</title>
</svelte:head>
<div>
	<ConnectBle />
	<Status isSender />
	<ControlWithStore />
	<Horn />
	<Lights />
</div>

<style>
</style>
