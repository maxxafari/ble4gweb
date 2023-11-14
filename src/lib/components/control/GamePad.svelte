<script lang="ts">
	import { btnPress, btnStore } from '$lib/buttonStore';
	import { onMount } from 'svelte';

	const controllerDeadPoint = 0.05;
	const absoluteMaxSpeed = 254;

	let poll: number = 0;
	let gamePadConnected = false;
	let maxSpeed = $btnStore.maxSpeed; // 20 is good for indoors 254 for outdoors

	export let ls = 0;
	export let rs = 0;

	let extraMaxSpeed = 0;

	function withinDeadPoint(x: number) {
		return x < controllerDeadPoint && x > -controllerDeadPoint ? true : false;
	}
	function tanCurve(x: number) {
		return Math.tan(x) / (Math.PI / 2);
	}

	function speedResolutionWithCorrection() {
		// corrects the speed resolution to be more accurate at low speeds
		//FIX THIS:  goes over top speed
		const topSpeed = maxSpeed + extraMaxSpeed;
		const scaleCorrection = topSpeed * controllerDeadPoint * Math.PI;
		return Math.floor(topSpeed + scaleCorrection);
	}

	function stickInputTranslation(x: number) {
		if (withinDeadPoint(x)) return 0;

		return Math.floor(tanCurve(x) * speedResolutionWithCorrection());
	}
	function triggerTranslation(x: number, speed: number) {
		if (withinDeadPoint(x)) return 0;
		const addedTriggerSpeedScale = absoluteMaxSpeed - maxSpeed;
		return Math.floor(tanCurve(x) * addedTriggerSpeedScale);
	}

	const boundCommands = {
		y: () => {
			btnPress('horn', false);
		},
		x: () => {
			btnPress('lights', true);
		}
		// lt: () => {
		// 	btnPress('speedMode', true);
		// }
	};

	$: stickl = () => {
		let x = axisMap.lx * 25;
		let y = axisMap.ly * 25;
		let rx = axisMap.lx * 10;
		let ry = axisMap.ly * 10;
		let z = 1 - buttonMap.lstick * 0.05;
		ls = stickInputTranslation(axisMap.ly) * -1;
		rs = stickInputTranslation(axisMap.lx);
		return `translateX(${x}%) translateY(${y}%) rotateY(${rx}deg) rotateX(${ry}deg) scale(${z})`;
	};

	$: stickr = () => {
		let x = axisMap.rx * 25;
		let y = axisMap.ry * 25;
		let rx = axisMap.rx * 10;
		let ry = axisMap.ry * 10;
		let z = 1 - buttonMap.rstick * 0.05;
		return `translateX(${x}%) translateY(${y}%) rotateY(${rx}deg) rotateX(${ry}deg) scale(${z})`;
	};

	$: trigger = (side: 'rt' | 'lt') => {
		let s = buttonMap[side];
		let sx = side === 'rt' ? -s : s;

		extraMaxSpeed = triggerTranslation(buttonMap['lt'], ls);
		return `
			transform: scaleX(${sx}) scaleY(${s}) rotate(-69deg);
			opacity: ${0.3 + s};
		`;
	};

	const buttonMap = {
		a: 0,
		b: 0,
		x: 0,
		y: 0,
		lb: 0,
		rb: 0,
		lt: 0,
		rt: 0,
		map: 0,
		menu: 0,
		lstick: 0,
		rstick: 0,
		du: 0,
		dd: 0,
		dl: 0,
		dr: 0,
		xbox: 0
	};

	const axisMap = {
		lx: 0,
		ly: 0,
		rx: 0,
		ry: 0
	};

	const plugIn = () => {
		startController();
		gamePadConnected = true;
		console.log('GamePad connected');
	};

	const unPlug = () => {
		cancelAnimationFrame(poll);
		gamePadConnected = false;
		console.log('GamePad lost connection');
	};

	const startController = () => {
		// runs on animation frame
		const gamepads = navigator.getGamepads();
		if (!gamepads) {
			return;
		}
		const pad = gamepads[0];
		const buttons = [
			'a',
			'b',
			'x',
			'y',
			'lb',
			'rb',
			'lt',
			'rt',
			'map',
			'menu',
			'lstick',
			'rstick',
			'du',
			'dd',
			'dl',
			'dr',
			'xbox'
		];
		const axes = ['lx', 'ly', 'rx', 'ry'];

		pad?.buttons.forEach((button, i) => {
			const buttonName = buttons[i];
			if (button.pressed) {
				// @ts-ignore
				buttonMap[buttons[i]] = button.value;
				// @ts-ignore
				if (boundCommands[buttonName]) {
					// @ts-ignore
					boundCommands[buttonName]();
				}
				if (!gamePadConnected) gamePadConnected = true;
			} else {
				// @ts-ignore
				buttonMap[buttons[i]] = 0;
			}
		});

		pad?.axes.forEach((axis, i) => {
			// @ts-ignore
			axisMap[axes[i]] = axis > 0.01 || axis < -0.01 ? parseFloat(axis.toFixed(3)) : 0;
		});

		poll = requestAnimationFrame(startController);
	};
	// on page reload call startController
	onMount(async () => {
		try {
			startController();
		} catch (e) {
			console.log(e);
		}
	});
</script>

<!-- svelte-ignore  -->
<svelte:window on:gamepadconnected={plugIn} on:gamepaddisconnected={unPlug} />

{#if gamePadConnected}
	<span>Gamepad connected</span>
	<div class="vals">
		<div>{axisMap.ly}</div>
		<div>{axisMap.rx}</div>
	</div>
{/if}
<div class="vals">
	<div>ls:{ls}</div>
	<div>rs:{rs}</div>
</div>
<div class="vals">
	<div>x:</div>
	<div>extraMaxSpeed:{extraMaxSpeed}</div>
</div>
<section class="controller" class:connected={gamePadConnected}>
	<div class="pad" />
	<div class="well left">
		<div class="stick" class:click={buttonMap.lstick} style="transform: {stickl()};" />
	</div>
	<div class="well right">
		<div class="stick" class:click={buttonMap.rstick} style="transform: {stickr()};" />
	</div>
	<button class="button a" class:on={buttonMap.a} />
	<button class="button b" class:on={buttonMap.b} />
	<button class="button x" class:on={buttonMap.x} />
	<button class="button y" class:on={buttonMap.y} />
	<button class="button map" class:on={buttonMap.map} />
	<button class="button menu" class:on={buttonMap.menu} />
	<button class="button xbox" class:on={buttonMap.xbox} />
	<button class="dpad du" class:on={buttonMap.du} />
	<button class="dpad dr" class:on={buttonMap.dr} />
	<button class="dpad dd" class:on={buttonMap.dd} />
	<button class="dpad dl" class:on={buttonMap.dl} />
	<button class="bumper left" class:on={buttonMap.lb} />
	<button class="bumper right" class:on={buttonMap.rb} />
	<button class="trigger left" style={trigger('lt')} />
	<button class="trigger right" style={trigger('rt')} />
</section>

<style>
	.vals {
		width: 210px;
		text-align: center;
		display: flex;
	}
	.vals div {
		width: 100px;
	}
	.controller {
		position: relative;
		width: 80%;
		opacity: 0.2;
	}
	.controller.connected {
		opacity: 1;
	}

	.controller > * {
		position: absolute;
		display: block;
		appearance: none;
		border: none;
		padding: 0;
		z-index: 1;
	}

	.controller > *:not(.pad):not(.stick):not(.well) {
		animation: flash 4s ease 1 2s;
	}

	.pad {
		background-image: url('/gamepad.jpg');
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 56.2416%;
	}

	.well {
		background: #16bef2;
		background-image: linear-gradient(25deg, #44494a, #555658 40%, #555658 60%, #44494a);
		left: 26.5%;
		top: 14.6%;
		width: 10.6%;
		padding-top: 10.2%;
		border-radius: 100%;
		box-shadow: inset 0.05vw -0.05vw 0.1vw 0.05vw rgba(0, 0, 0, 0.3),
			inset -0.05vw 0.05vw 0.05vw 0.05vw rgba(255, 255, 255, 0.3);
	}

	.well.right {
		left: auto;
		right: 35.1%;
		top: 33.1%;
	}

	.well::before {
		content: '';
		position: absolute;
		left: 7%;
		top: 8%;
		width: 86%;
		height: 84%;
		border-radius: 100%;
		background-color: #16bef2;
		box-shadow: inset -0.05vw 0.1vw 0.2vw 0.2vw #444547, inset 0vw -0.1vw 0.1vw 0.1vw #18607c,
			inset 0 0 0 0.2vw #444547, inset 0 0 0.2vw 0.5vw #18607c, inset 0 0 2vw 1vw #18607c;
		z-index: 0;
	}

	.stick {
		position: absolute;
		left: 11%;
		top: 2%;
		background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/13471/xbox-controller.jpg');
		width: 78%;
		padding-top: 78%;
		background-position: 30.1% 18.5%;
		background-size: 1300%;
		border-radius: 100%;
		box-shadow: inset 0.5vw -0.5vw 1vw 0.1vw rgba(0, 0, 0, 0.3), -0.5vw 1vw 1vw rgba(0, 0, 0, 0.5),
			-1.2vw 2vw 2vw rgba(0, 0, 0, 0.6);
		transition: none;
		z-index: 3;
	}

	.stick:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #aaa;
		border-radius: 100%;
		mix-blend-mode: overlay;
		box-shadow: inset 0 0 1vw 1vw rgba(255, 255, 255, 0),
			inset 0 0 0.3vw 0.5vw rgba(97, 229, 255, 0.5), 0 0 0.6vw 0.4vw rgba(94, 224, 248, 1),
			0 0 1.2vw 0.4vw rgba(94, 224, 248, 0.8);
		transition: all 0.1s ease;
		opacity: 0;
	}

	.button.on,
	.dpad.on,
	.bumper.on,
	.stick.click:after {
		opacity: 1;
	}

	.button {
		width: 4.7%;
		padding-top: 4.7%;
		border-radius: 100%;
		right: 29.3%;
		top: 28%;
		background: #5cff00;
		box-shadow: 0.1vw 0.2vw 0.4vw 0.3vw #5cff00, 0.1vw 0.3vw 2vw 0.5vw #5cff00;
		mix-blend-mode: overlay;
		transition: all 0.25s ease;
		z-index: 2;
		opacity: 0;
	}

	.button.b {
		right: 24.4%;
		top: 21%;
		background: #ff0033;
		box-shadow: 0vw 0vw 0.4vw 0.3vw #ff0033, 0.1vw 0.3vw 2vw 0.5vw #ff0033;
	}

	.button.x {
		right: 34.1%;
		top: 20%;
		background: #00ebff;
		box-shadow: 0.1vw 0.2vw 0.4vw 0.3vw #00ebff, 0.1vw 0.3vw 2vw 0.5vw #00ebff;
	}

	.button.y {
		right: 29.3%;
		top: 12%;
		background: #ffd600;
		box-shadow: 0vw 0.1vw 0.4vw 0.3vw #ffd600, 0.1vw 0.3vw 2vw 0.5vw #ffd600;
	}

	.button.map,
	.button.menu {
		left: 43.4%;
		top: 21.4%;
		width: 2.9%;
		padding-top: 2.8%;
		background: white;
		box-shadow: inset 0 0 0.5vw 0.2vw #5ee0f8, 0 0.1vw 0.3vw 0.4vw #5ee0f8,
			0 0.1vw 1.5vw 0.7vw #5ee0f8, 0 0.1vw 0.2vw 0.1vw #5ee0f8;
	}

	.button.menu {
		left: 53.8%;
	}

	.button.xbox {
		left: 47.6%;
		top: 7.7%;
		width: 4.8%;
		padding-top: 4.4%;
		background: #5cff00;
		mix-blend-mode: screen;
		box-shadow: inset 0 0 0.1vw 0.1vw white, 0 0.1vw 0.2vw 0.2vw white, 0 0.1vw 0.5vw 0.1vw white,
			0 0.1vw 2vw 0.5vw rgba(92, 255, 0, 0.7);
		transition-duration: 0.5s;
	}

	.dpad {
		width: 3.5%;
		padding-top: 4.8%;
		border-radius: 20%;
		left: 38.8%;
		top: 34.8%;
		background: linear-gradient(0deg, transparent, #4ed5e0, #33f0ff);
		box-shadow: 0 -1.4vw 1.7vw 0.2vw #4ed5e0, 0 -2vw 1.4vw 0.2vw rgba(255, 255, 255, 0.1);
		mix-blend-mode: overlay;
		transition: all 0.2s ease;
		opacity: 0;
	}

	.dpad.dr {
		left: 42%;
		top: 40%;
		transform: rotate(90deg);
	}

	.dpad.dd {
		top: 46%;
		transform: rotate(180deg);
	}

	.dpad.dl {
		left: 35.6%;
		top: 40%;
		transform: rotate(270deg);
	}

	.bumper {
		left: 25.5%;
		top: 3.6%;
		width: 13%;
		padding-top: 4%;
		transform: rotate(-20deg);
		border-radius: 100%;
		background: #7edbff;
		box-shadow: -0vw -0vw 2vw 1vw #7edbff;
		mix-blend-mode: darken;
		transition: all 0.2s ease;
		opacity: 0;
	}

	.bumper:after {
		content: '';
		left: 20%;
		top: 10%;
		width: 60%;
		height: 40%;
		border-radius: 100%;
		background: cyan;
		mix-blend-mode: screen;
		box-shadow: -0vw -0vw 1vw 0.5vw cyan;
		z-index: 2;
	}

	.bumper.right {
		left: auto;
		right: 25.4%;
		transform: scaleX(-1) rotate(-22deg);
	}

	.trigger {
		left: 15.1%;
		top: 24%;
		width: 10%;
		padding-top: 6px;
		transform: scaleX(1) scaleY(1) rotate(-69deg); /*nice*/
		border-radius: 2vw;
		background: #7edbff;
		box-shadow: -0vw -1vw 4vw 4vw #7edbff;
		mix-blend-mode: darken;
		transition: all 0.2s ease;
		opacity: 0;
	}

	.trigger.right {
		left: auto;
		right: 15.1%;
		transform: scaleX(-1) scaleY(1) rotate(-69deg); /*nice*/
	}

	@keyframes flash {
		0% {
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
	}
</style>
