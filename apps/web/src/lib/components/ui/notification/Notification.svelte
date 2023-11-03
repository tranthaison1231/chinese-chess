<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { modalState } from './state';
</script>

<Dialog.Root bind:open={$modalState.open}>
	<Dialog.Content class="sm:max-w-[425px]">
		<div class="dialog-header">
			<div class="dialog-title">{$modalState.title}</div>
			{#if $modalState.description}
				<div class="dialog-description">
					{$modalState.description}
				</div>
			{/if}
		</div>
		<div class="dialog-footer">
			{#if $modalState.onCancel}
				<Dialog.Close
					class={buttonVariants({
						variant: 'outline'
					})}
					on:click={$modalState.onCancel}
				>
					Cancel
				</Dialog.Close>
			{/if}
			<Dialog.Close class={buttonVariants()} on:click={$modalState.onOK}>OK</Dialog.Close>
		</div>
	</Dialog.Content>
</Dialog.Root>
