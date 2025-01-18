# Loading of images (Lazy and Progressive)



| **Aspect**           | **Lazy Loading**                   | **Progressive Loading**                            |
| -------------------- | ---------------------------------- | -------------------------------------------------- |
| **When images load** | Only when needed (e.g., on scroll) | Loads immediately, starting low-quality            |
| **Purpose**          | Improves performance and load time | Improves user experience during loading            |
| **Use case**         | Long pages with many images        | Large images that are critical to show immediately |


## 1. Lazy Loading

Lazy loading delays the loading of an image until it is needed, typically when it is about to come into the user's viewport (i.e., when the user scrolls down to where the image is located). This technique helps improve the initial page load time by not loading all images at once.

### How it works:

Instead of downloading all images when the page loads, only the images visible on the screen are loaded.
As the user scrolls, additional images are fetched and rendered just in time.

### Benefits:

Reduces initial page load time.
Saves bandwidth for users who may not scroll through the entire page.
Improves performance on slower connections.

`<img src="placeholder.jpg" data-src="actual-image.jpg" loading="lazy" alt="Lazy loaded image">`

```js
<img
	data-src={url}
	alt="Lazy loaded"
	class="h-full w-full object-cover"
	loading="lazy"
	use:lazyLoad
/>
```

> Example for lazy loading
> this is `$lib/utils/lazyload.ts`

```js
export function lazyLoad(node: HTMLImageElement) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target as HTMLImageElement;
                img.src = img.dataset.src || '';
                observer.unobserve(img);
            }
        });
    });

    observer.observe(node);

    return {
        destroy() {
            observer.disconnect();
        },
    };
}
```

And this is `lazyload.svelte`

```js
<script lang="ts">
	import { lazyLoad } from '$lib/utils';
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
	<div class="justify-center space-y-4 bg-yellow-200">
		{#if images.length === 0}
			<p class="text-center text-gray-500">Loading images...</p>
		{:else}
			{#each images as { id, url }}
				<div class="flex h-64 w-fit items-center justify-center bg-gray-500">
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
```

## 2. Progressive Loading

Progressive loading is about how an image is displayed while it is being downloaded. A progressive image is typically saved in a format (e.g., JPEG) that loads a lower-quality version of the image first and then improves its quality as more data is loaded.

### How it works:

- When an image starts downloading, a blurry or pixelated version appears first.
- The image progressively becomes clearer as more data is downloaded.

### Benefits:

1. Provides a better user experience by showing something (even if it's low-quality) right away.
2. Particularly useful for larger images or slower connections.

### Example:

Progressive JPEG is a common format for implementing this technique.

```js
<div class="relative flex h-64 w-full items-center justify-center overflow-hidden bg-gray-200">
	<img
		src={lowResUrl}
		alt="Blurry placeholder"
		class="absolute h-full w-full scale-110 object-cover blur-lg filter transition-opacity duration-500"
	/>

	<img
		src={url}
		alt={`Progressive image ${id}`}
		class="absolute h-full w-full object-cover opacity-0 transition-opacity duration-500"
		on:load={(e) => e.target.classList.remove('opacity-0')}
	/>
</div>
```

> Example of progressive loading

```js
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
```
