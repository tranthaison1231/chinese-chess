<script lang="ts">
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";

  const onSubmit = (e: SubmitEvent)  => {
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const name = data.get("name");
    const roomID = data.get("roomID");
    goto(`/rooms/${roomID}?username=${name}`);
  }

</script>
<form class="space-y-6 w-1/3 h-fit border p-6 shadow-md" on:submit|preventDefault={onSubmit}>
  <h1 class="text-center text-2xl"> Login </h1>
  <input class="input" placeholder="Enter name" type="text" name="name"/>
  <input class="input" placeholder="Enter room ID" type="text" name="roomID"/>
  <Button class="w-full" type="submit">Submit </Button>
</form>
