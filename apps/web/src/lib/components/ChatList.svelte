<script lang="ts">
	import { me } from '$lib/stores';
	import { cn } from '$lib/utils/cn';
	import type { Message } from '$lib/utils/type';
	import { SendHorizonal, ThumbsUp } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import EmojiPicker from './EmojiPicker.svelte';
	import VoiceButton from './VoiceButton.svelte';

	const dispatch = createEventDispatcher();

	export let messages: Message[] = [];
	export let chatEl: HTMLDivElement | null, onTurnOnVoiceChat: (stream: MediaStream) => void, 
	onTurnOffVoiceChat: () => void, 
    onGetUserMediaError: (error: unknown) => void;;
	
	let message: string = '';
	
	$: isMessageValid = message?.trim().length > 0;

	async function sendMessage(content: string)  {
		dispatch('sendMessage', {
			content: content
		});
		message = '';
	}

	function onKeyUp(e: KeyboardEvent) {
		if (e.key === 'Enter' && isMessageValid) {
			sendMessage(message);
		}
	}
</script>

<div class="h-3/5 space-y-3">
	<h2 class="text-xl font-bold flex items-center justify-between">
		<p>
			Chat 
		</p>
		<VoiceButton {onTurnOnVoiceChat} {onTurnOffVoiceChat} {onGetUserMediaError} />
	</h2>
	<div class="h-[calc(100%-40px)] border p-2">
		<div bind:this={chatEl} class="mb-4 h-[calc(100%-56px)] space-y-1 overflow-y-scroll">
			{#each messages as message}
				{@const isMe = message.username === $me?.username}
				<div
					class={cn('flex flex-col', {
						'items-end': isMe
					})}
				>
					{#if !isMe}
						<p class="text-base">{message.username}</p>
					{/if}
					<div
						class={cn('w-fit rounded-full bg-gray-100 px-4 py-2', {
							'bg-blue-500': isMe,
							'text-white': isMe
						})}
					>
						{message.content}
					</div>
				</div>
			{/each}
		</div>
		<div class="flex items-center gap-1">
			<div class="relative w-full">
				<input
					placeholder="Aa"
					class="input bg-gray-100 focus-visible:ring-transparent"
					bind:value={message}
					on:keyup|preventDefault={onKeyUp}
				/>
				<EmojiPicker onEmojiSelect={(emoji) => message = message + emoji.native} />
			</div>
			{#if isMessageValid}
				<button on:click={() => {
					sendMessage(message);
				}}>
					<SendHorizonal class="cursor-pointer text-blue-500" />
				</button>
			{:else}
				<button on:click={() => sendMessage('👍')}>
					<ThumbsUp class="cursor-pointer text-blue-500" />
				</button>
			{/if}
		</div>
	</div>
</div>
