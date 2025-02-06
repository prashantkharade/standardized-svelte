<!-- <script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const events = writable<string[]>([]);

	onMount(() => {
		const eventSource = new EventSource('/api/server/sse');

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			events.update((current) => [...current, `${data.message} at ${data.timestamp}`]);
		};

		eventSource.onerror = () => {
			console.error('SSE connection error. Closing connection.');
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	});
</script>

<div class="p-4">
	<h1 class="mb-4 text-xl font-bold">Server-Sent Events</h1>
	<ul class="space-y-2">
		{#each $events as event}
			<li class="rounded bg-gray-100 p-2">{event}</li>
		{/each}
	</ul>
</div> -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const updates = writable<string[]>([]); // Store the updates

	onMount(() => {
		const eventSource = new EventSource('/api/server/sse');

		eventSource.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log(data,"data=====================================================")
			updates.update((current) => [...current, `Data: ${JSON.stringify(data)} | Body: ${data.Data.Body}`]);
		};

		eventSource.onerror = () => {
			console.error('SSE connection error. Closing connection.');
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	});
</script>

<div class="p-4">
	<h1 class="mb-4 text-xl font-bold">Real-Time Data Updates</h1>
	<ul class="space-y-2">
		{#each $updates as update}
			<li class="rounded bg-gray-100 p-2">{update}</li>
		{/each}
	</ul>
</div>

