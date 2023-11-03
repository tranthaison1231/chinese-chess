<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";

  export let title  = 'Confirm'; 
  export let description = 'Are you sure?';
</script>
<Dialog.Root>
  <Dialog.Trigger class={buttonVariants()}>
    <slot />
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <div class="dialog-header">
      <div class="dialog-title">{title}</div>
      <div class="dialog-description">
        {description}
      </div>
    </div>
    <div class="dialog-footer">
      <Dialog.Close class={buttonVariants({ variant: 'outline'})}>Cancel</Dialog.Close>
      <Dialog.Close class={buttonVariants()} on:click>OK </Dialog.Close>
    </div>
  </Dialog.Content>
</Dialog.Root>
