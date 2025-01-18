<script>
	import { dndzone } from 'svelte-dnd-action';
	import { writable } from 'svelte/store';

	const items = writable([
		{ id: 1, name: 'Item 1' },
		{ id: 2, name: 'Item 2' },
		{ id: 3, name: 'Item 3' },
		{ id: 4, name: 'Item 4' }
	]);

	function handleItemsReordered({ items: newItems }) {
		items.set(newItems);
	}
</script>

<div use:dndzone={{ items, flipDurationMs: 200 }} on:consider={handleItemsReordered}>
	{#each $items as item (item.id)}
		<div class="mb-2 rounded bg-blue-200 p-4 shadow">{item.name}</div>
	{/each}
</div>

<style>
	div[draggable='true'] {
		cursor: grab;
	}
	div[dragging='true'] {
		cursor: grabbing;
	}
</style>
