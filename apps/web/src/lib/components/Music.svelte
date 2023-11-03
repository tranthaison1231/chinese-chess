<script lang="ts">
	import audioBackground from '$lib/assets/audios/music.mp3';
	import { Volume2Icon, VolumeXIcon } from 'lucide-svelte';
	let paused = true;
</script>

<button
	class="hover:scale-105"
	on:click={() => {
		paused = !paused
	}}
>
	{#if paused}
    <VolumeXIcon />
	{:else}
		<Volume2Icon />
	{/if}
</button>

<svelte:window
	on:click|once={() => {
		paused = false
	}}
/>
<audio bind:paused={paused} loop>
	<source src={audioBackground} type="audio/mpeg" />
</audio>
