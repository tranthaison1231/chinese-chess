<script lang="ts">
	import { useQuery } from '@sveltestack/svelte-query';

	export let url: string;

	const queryResult = useQuery(['metatags', url], () =>
		fetch(`/api/metatags?url=${url}`).then((res) => res.json())
	);
</script>
{#if $queryResult.data?.result?.ogImage}
	<a href={url} target="_blank">
		<img src={$queryResult?.data?.result.ogImage?.[0]?.url} alt="" />
		<p class="p-2 text-sm font-bold">
			{$queryResult?.data?.result?.ogTitle}
		</p>
	</a>
{/if}
