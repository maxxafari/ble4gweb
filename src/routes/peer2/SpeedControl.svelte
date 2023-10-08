<script lang="ts">
	import { searingStore } from './stearing';
	let speed = 50;
	let timer: NodeJS.Timeout | undefined = undefined;

	function pad(num: number, size: number = 3) {
		const s: string = '000000000' + num;
		return s.substr(s.length - size);
	}

	const debounce = (func: Function) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func();
		}, 300);
	};

	$: {
		debounce(() => {
			$searingStore.speed = speed;
		});
	}
</script>

<div>
	<label for="speed">
		Speed: {pad(speed)}
	</label>
	<input type="range" name="speed" min="0" max="254" bind:value={speed} />
</div>
```

<style>
	label {
		padding: 6px;
	}
	input {
		width: 90vw;
		max-width: 300px;
	}
	div {
		padding: 6px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
