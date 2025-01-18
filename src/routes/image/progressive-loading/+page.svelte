<script lang="ts">
	import { onMount } from 'svelte';

	interface Image {
		id: number;
		url: string;
		lowResUrl: string;
	}

	let images: Image[] = [];
	let isLoading = true;

	async function fetchImages() {
		const response = await fetch('/api/server/images');
		if (!response.ok) {
			console.error('Failed to fetch images:', response.statusText);
			return;
		}

		const data = await response.json();
		// Add a low-res version for each image
		images = data.map((image: { id: number; url: string }) => ({
			...image,
			lowResUrl: `${image.url}&blur=10`
		}));
		isLoading = false;
	}

	onMount(() => {
		fetchImages();
	});
</script>

<div class="container mx-auto space-y-6 p-4">
	<h1 class="text-center text-2xl font-bold">Progressive Loading Demo</h1>
	<div class="text-center">
		<a href="/image/lazy-loading">
			<button class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
				Go to Lazy Loading
			</button>
		</a>
	</div>

	<div class="space-y-4">
		{#if isLoading}
			<!-- Skeleton Loader -->
			{#each Array(3) as _, i (i)}
				<div class="h-64 w-full animate-pulse bg-gray-200"></div>
			{/each}
		{:else}
			{#each images as { id, url, lowResUrl }}
				<div
					class="relative flex h-64 w-full items-center justify-center overflow-hidden bg-gray-200"
				>
					<!-- Low resolution blurry placeholder -->
					<img
						src={lowResUrl}
						alt="Blurry placeholder"
						class="absolute h-full w-full scale-110 object-cover blur-lg filter transition-opacity duration-500"
					/>
					<!-- High resolution image -->
					<img
						src={url}
						alt={`Progressive image ${id}`}
						class="absolute h-full w-full object-cover opacity-0 transition-opacity duration-500"
						on:load={(e) => e.target.classList.remove('opacity-0')}
					/>
				</div>
			{/each}
		{/if}
	</div>
</div>
