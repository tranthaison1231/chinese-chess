<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { Smile } from 'lucide-svelte';
	import Emoji from './Emoji.svelte';

	export let onEmojiSelect: (emoji: { native: string }) => void;
</script>

<Popover.Root
	positioning={{
		placement: 'top-start'
	}}
>
	<Popover.Trigger class="absolute right-1 top-2">
		<Smile class="text-blue-500" />
	</Popover.Trigger>
	<Popover.Content class="w-fit p-0">
		<Emoji {onEmojiSelect} />
	</Popover.Content>
</Popover.Root>
