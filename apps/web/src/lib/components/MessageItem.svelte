<script lang="ts">
	import { me } from '$lib/stores';
	import { cn } from '$lib/utils/cn';
	import type { Message } from '$lib/utils/type';
	import linkifyHtml from "linkify-html";
	import PreviewLink from './PreviewLink.svelte';

	export let message: Message;
		
  const isMe = message.username === $me?.username
	const content = linkifyHtml(message.content, {
		target: "_blank",
		className: "underline break-all",
	});
	$: url = message.content.match(/(?:https?|ftp):\/\/[^\s]+/g)?.[0];

</script>

<div
	class={cn('flex flex-col', {
		'items-end': isMe
	})}
>
	{#if !isMe}
		<p class="text-base">{message.username}</p>
	{/if}
	<div
		class={cn('w-fit rounded-sm bg-gray-100 ', {
			'bg-blue-500': isMe,
			'text-white': isMe
		})}
	>
		<div class="p-2">{@html content}</div>
		{#if url}
			<PreviewLink url={url}/>
		{/if}
	</div>
</div>
