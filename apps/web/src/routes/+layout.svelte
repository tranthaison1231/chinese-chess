<script>
	import "../app.css";
	import { Notification } from "$lib/components/ui/notification";
</script>
<svelte:head>
    <title>China Chess</title> 
</svelte:head>
<Notification />
<div class="flex justify-center h-screen items-center">
	<slot />
</div>
