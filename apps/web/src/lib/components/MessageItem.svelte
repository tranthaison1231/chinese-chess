<script lang="ts">
	import { me } from '$lib/stores';
	import { cn } from '$lib/utils/cn';
	import type { Message } from '$lib/utils/type';
	import linkifyHtml from "linkify-html";

	export let message: Message;
		
  const isMe = message.username === $me?.username
	const content = linkifyHtml(message.content, {
		target: "_blank",
		className: "underline"
	});

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
		class={cn('w-fit rounded-full bg-gray-100 px-4 py-2', {
			'bg-blue-500': isMe,
			'text-white': isMe
		})}
	>
		{@html content}
	</div>
</div>
