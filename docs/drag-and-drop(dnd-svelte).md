### Example code

in `index.ts` file

```js
export enum ViewType {
    LIST = 'list',
    GRID = 'grid'
}

// Types
export type Button = {
    id: number;
    name: string;
    icon: string;
};

export type DroppedItem = Button & {
    dropTime: string;
    uniqueId: string;
};
```

```js
<script lang="ts">
	import { ViewType, type Button, type DroppedItem } from '$lib';
	import { writable } from 'svelte/store';

  // Initial State
const initialButtons: Button[] = [
  { id: 1, name: 'Button 1', icon: '🔘' },
  { id: 2, name: 'Button 2', icon: '🕹️' },
  { id: 3, name: 'Button 3', icon: '✨' },
  { id: 4, name: 'Button 4', icon: '🌟' }
];

	// Store
	const store = writable({
		availableButtons: initialButtons,
		droppedItems: [] as DroppedItem[],
		currentView: ViewType.LIST
	});

	let draggedItem: DroppedItem | Button | null = null;
	let draggedOverItem: DroppedItem | null = null;

	// Confirmation Modal State
	let showConfirmModal = false;
	let itemToDelete: DroppedItem | null = null;

	// Drag and Drop Handlers
	function handleDragStart(item: Button | DroppedItem, event: DragEvent) {
		draggedItem = item;
		// Ensure drag is possible
		event.dataTransfer?.setData('text/plain', '');
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleDragEnter(item: DroppedItem) {
		draggedOverItem = item;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();

		if (draggedItem) {
			store.update((currentStore) => {
				// If dragging from available buttons
				if ('id' in draggedItem && !('dropTime' in draggedItem)) {
					const newDroppedItem: DroppedItem = {
						...draggedItem,
						dropTime: new Date().toLocaleString(),
						uniqueId: `${draggedItem.id}-${Date.now()}`
					};

					return {
						...currentStore,
						droppedItems: [...currentStore.droppedItems, newDroppedItem]
					};
				}

				// If swapping within dropped items
				if (draggedItem !== draggedOverItem && draggedOverItem) {
					const updatedDroppedItems = currentStore.droppedItems.map((item) => {
						if (item.uniqueId === draggedItem.uniqueId) {
							return { ...draggedOverItem, uniqueId: item.uniqueId };
						}
						if (item.uniqueId === draggedOverItem.uniqueId) {
							return { ...draggedItem, uniqueId: item.uniqueId };
						}
						return item;
					});

					return {
						...currentStore,
						droppedItems: updatedDroppedItems
					};
				}

				return currentStore;
			});

			draggedItem = null;
			draggedOverItem = null;
		}
	}

	// Confirmation Modal Handlers
	function openDeleteConfirmation(item: DroppedItem) {
		itemToDelete = item;
		showConfirmModal = true;
	}

	function handleConfirmDelete() {
		if (itemToDelete) {
			store.update((currentStore) => ({
				...currentStore,
				droppedItems: currentStore.droppedItems.filter(
					(item) => item.uniqueId !== itemToDelete?.uniqueId
				)
			}));

			showConfirmModal = false;
			itemToDelete = null;
		}
	}

	function handleCancelDelete() {
		showConfirmModal = false;
		itemToDelete = null;
	}

	// View Toggle Handler
	function toggleView(view: ViewType) {
		store.update((currentStore) => ({
			...currentStore,
			currentView: view
		}));
	}
</script>

<!-- Confirmation Modal -->
{#if showConfirmModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
		role="dialog"
		aria-modal="true"
		aria-labelledby="confirm-delete-title"
	>
		<div class="rounded-lg bg-white p-6 shadow-xl">
			<h2 id="confirm-delete-title" class="mb-4 text-xl font-bold">Confirm Deletion</h2>
			<p class="mb-4">Are you sure you want to delete this item?</p>
			<div class="flex justify-end space-x-2">
				<button
					class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
					on:click={handleCancelDelete}
				>
					Cancel
				</button>
				<button
					class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
					on:click={handleConfirmDelete}
				>
					Confirm
				</button>
			</div>
		</div>
	</div>
{/if}

<div class="flex h-screen">
	<!-- Left Sidebar: Available Buttons -->
	<div class="w-1/5 border-r bg-gray-100 p-4">
		<h3 class="mb-4 text-lg font-bold">Drag Buttons</h3>
		{#each $store.availableButtons as button}
			<div
				class="mb-2 cursor-move rounded bg-white p-3 shadow"
				draggable="true"
				role="button"
				tabindex="0"
				on:dragstart={(event) => handleDragStart(button, event)}
				on:keydown={(event) => event.key === 'Enter' && handleDragStart(button, event)}
			>
				<span class="mr-2">{button.icon}</span>
				{button.name}
			</div>
		{/each}
	</div>

	<!-- Right Content Area -->
	<div
		class="w-4/5 bg-white p-4"
		role="region"
		aria-label="Droppable Area"
		on:dragover={handleDragOver}
		on:drop={handleDrop}
	>
		<!-- View Toggle -->
		<div
			class="mb-6 flex justify-center space-x-4"
			role="toolbar"
			aria-label="View selection toolbar"
		>
			<button
				class={`rounded px-4 py-2 ${
					$store.currentView === ViewType.LIST ? 'bg-blue-500 text-white' : 'bg-gray-200'
				}`}
				on:click={() => toggleView(ViewType.LIST)}
				aria-pressed={$store.currentView === ViewType.LIST}
			>
				List View
			</button>
			<button
				class={`rounded px-4 py-2 ${
					$store.currentView === ViewType.GRID ? 'bg-blue-500 text-white' : 'bg-gray-200'
				}`}
				on:click={() => toggleView(ViewType.GRID)}
				aria-pressed={$store.currentView === ViewType.GRID}
			>
				Grid View
			</button>
		</div>

		<!-- Dropped Items Display -->
		{#if $store.currentView === ViewType.LIST}
			<!-- List View -->
			<div class="space-y-2" role="list" aria-label="Dropped items list">
				{#each $store.droppedItems as item (item.uniqueId)}
					<div
						class="flex items-center justify-between rounded bg-gray-50 p-3 shadow"
						draggable="true"
						role="listitem"
						tabindex="0"
						on:dragstart={(event) => handleDragStart(item, event)}
						on:dragenter={() => handleDragEnter(item)}
						on:keydown={(event) => event.key === 'Enter' && handleDragStart(item, event)}
					>
						<div>
							<span class="mr-2">{item.icon}</span>
							{item.name}
							<span class="ml-2 text-sm text-gray-500">{item.dropTime}</span>
						</div>
						<button
							class="rounded-full p-1 text-red-500 hover:bg-red-100"
							on:click={() => openDeleteConfirmation(item)}
							aria-label="Delete item"
						>
							❌
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Grid/Table View -->
			<div class="w-full" role="region" aria-label="Dropped items table">
				<table class="w-full border-collapse" role="grid" aria-label="Dropped items grid">
					<thead>
						<tr class="bg-gray-100">
							<th class="border p-2">Icon</th>
							<th class="border p-2">Name</th>
							<th class="border p-2">Drop Time</th>
							<th class="border p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each $store.droppedItems as item (item.uniqueId)}
							<tr
								class="hover:bg-gray-50"
								draggable="true"
								role="row"
								tabindex="0"
								on:dragstart={(event) => handleDragStart(item, event)}
								on:dragenter={() => handleDragEnter(item)}
								on:keydown={(event) => event.key === 'Enter' && handleDragStart(item, event)}
							>
								<td class="border p-2 text-center" role="gridcell">{item.icon}</td>
								<td class="border p-2" role="gridcell">{item.name}</td>
								<td class="border p-2" role="gridcell">{item.dropTime}</td>
								<td class="border p-2 text-center" role="gridcell">
									<button
										class="rounded-full p-1 text-red-500 hover:bg-red-100"
										on:click={() => openDeleteConfirmation(item)}
										aria-label="Delete item"
									>
										❌
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

```
