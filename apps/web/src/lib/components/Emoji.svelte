<script lang="ts">
  import data from '@emoji-mart/data';
  import { Picker } from 'emoji-mart';
  import { onMount } from "svelte";
	
  let picker: HTMLDivElement;
  export let onEmojiSelect: (emoji: { native: string }) => void

	onMount(() => {
		new Picker({
			data,
      parent: picker,
      theme: 'light',
      onEmojiSelect
		})
    return () => {
      picker.remove()
    }
	});
</script>
<div bind:this={picker}  />

