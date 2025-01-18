<script>
	import { dndzone } from 'svelte-dnd-action';
	import { writable } from 'svelte/store';

	const rows = writable([
		{ id: 1, name: 'John Doe', age: 25 },
		{ id: 2, name: 'Jane Smith', age: 30 },
		{ id: 3, name: 'Alice Brown', age: 28 },
		{ id: 4, name: 'Bob Johnson', age: 35 }
	]);

	function handleRowsReordered({ items: newRows }) {
		rows.set(newRows);
	}
</script>

<table class="w-full border-collapse border border-gray-300">
	<thead>
		<tr class="bg-gray-200">
			<th class="border border-gray-300 p-2">Name</th>
			<th class="border border-gray-300 p-2">Age</th>
		</tr>
	</thead>
	<tbody use:dndzone={{ items: rows, flipDurationMs: 200 }} on:consider={handleRowsReordered}>
		{#each $rows as row (row.id)}
			<tr class="hover:bg-gray-100">
				<td class="border border-gray-300 p-2">{row.name}</td>
				<td class="border border-gray-300 p-2">{row.age}</td>
			</tr>
		{/each}
	</tbody>
</table>

<style>
	tbody tr[draggable='true'] {
		cursor: grab;
	}
	tbody tr[dragging='true'] {
		cursor: grabbing;
		background-color: #f9f9f9;
	}
</style>
