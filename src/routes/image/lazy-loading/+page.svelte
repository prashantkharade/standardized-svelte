<script lang="ts">
	import { lazyLoad } from '$lib/index';
	import { onMount } from 'svelte';

	interface Image {
		id: number;
		url: string;
	}

	let images: Image[] = [];

	async function fetchImages() {
		const response = await fetch('/api/server/images');
		images = await response.json();
	}

	onMount(() => {
		fetchImages();
	});
</script>

<div class="container mx-auto space-y-6 p-4">
	<h1 class="text-center text-2xl font-bold">Lazy Loading Demo</h1>
	<div class="text-center">
		<a href="/image/progressive-loading">
			<button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
				Go to Progressive Loading
			</button>
		</a>
	</div>
	<div class="justify-center space-y-4 ">
		{#if images.length === 0}
			<p class="text-center text-gray-500">Loading images...</p>
		{:else}
			{#each images as { id, url }}
				<div class="flex h-64 w-full items-center justify-center bg-gray-500">
					<img
						data-src={url}
						alt="Lazy loaded"
						class="h-full w-full object-cover"
						loading="lazy"
						use:lazyLoad
					/>
				</div>
			{/each}
		{/if}
	</div>
</div>
