<script lang="ts">
	import { MicIcon, MicOffIcon } from "lucide-svelte";

	export let onTurnOnVoiceChat: (stream: MediaStream) => void | Promise<void>, 
    onTurnOffVoiceChat: () => void, 
    onGetUserMediaError: (error: unknown) => void;

	let voiceChatEnabled: boolean = false; 
  
	$: {
    if(!voiceChatEnabled) {
      onTurnOffVoiceChat?.()
    } else {
      navigator.mediaDevices.getUserMedia({
        'audio': true
      })
      .then(async stream => {
        await onTurnOnVoiceChat?.(stream)
      })
      .catch(error => {
        voiceChatEnabled = false
        onGetUserMediaError(error)
      });
    }
	}

  function onToggleVoice() {
		voiceChatEnabled = !voiceChatEnabled
	}
</script>

<button on:click={onToggleVoice}>
  {#if voiceChatEnabled} 
  <MicIcon /> 
  {:else}
  <MicOffIcon />
  {/if}
</button>

<!-- <audio id="voice-recorder" playsinline autoplay>
  <source  type="audio/mpeg" />
</audio> -->
