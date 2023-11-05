<script lang="ts">
	import { createEventDispatcher, onDestroy } from 'svelte';

	export let on = false;
	const dispatch = createEventDispatcher();

	let timeout: number = 900;
	let now = Date.now();
	let interval: ReturnType<typeof setInterval>;5

	$: end = now + timeout * 1000;
	$: count = Math.round((end - now) / 1000);
	$: h = Math.floor(count / 3600);
	$: m = Math.floor((count - h * 3600) / 60);
	$: s = count - h * 3600 - m * 60;

	const startInterval = () => {
		clearInterval(interval);
		interval = setInterval(() => {
			timeout -= 1;
		}, 1000);
	};

	$: {
		if (on && count !== 0) {
			startInterval();
		} else {
			clearInterval(interval);
			if (count === 0) {
				dispatch('end');
			}
		}
	}

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div>
	{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
</div>
