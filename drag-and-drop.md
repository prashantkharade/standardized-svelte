## 1. Drag-and-Drop Utility Functions (drag-and-drop.ts):

### draggable function:

#### Makes an HTML element draggable.

1. Sets draggable to true and changes the cursor style to "grab."
2. Adds a dragstart event listener that:

   - Serializes the given data object into a string.
   - Stores it in the dataTransfer object of the DragEvent under the key "text/plain".

3. Lifecycle:
   - update: Updates the data associated with the draggable element.
   - destroy: Cleans up the dragstart event listener.

### dropzone function:

#### Makes an HTML element act as a drop zone for draggable items.

1. Adds event listeners for dragenter, dragleave, dragover, and drop:

   - dragenter: Adds a CSS class (dragover_class) to highlight the drop zone.
   - dragleave: Removes the CSS class when the draggable leaves the drop zone.
   - dragover: Prevents the default browser behavior and sets the dropEffect (e.g., "copy").
   - drop: Extracts the data from the dataTransfer object and calls the on_dropzone callback with the data and event.

2. Lifecycle:
   - update: Updates the options such as dropEffect, dragover_class, and on_dropzone.
   - destroy: Cleans up all event listeners.

### First define dropzone and draggable in path `$lib/utils/drag-and-drop.ts` file.

They are like

```js
export function draggable<T>(node: HTMLElement, data: T) {
    node.draggable = true;
    node.style.cursor = 'grab';

    function handle_dragstart(e: DragEvent) {
        if (!e.dataTransfer) return;
        e.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    node.addEventListener('dragstart', handle_dragstart);

    return {
        update(newData: T) {
            data = newData;
        },
        destroy() {
            node.removeEventListener('dragstart', handle_dragstart);
        }
    };
}

interface DropzoneOptions<T> {
    dropEffect?: 'copy' | 'move' | 'link' | 'none';
    dragover_class?: string;
    on_dropzone?: (data: T, e: DragEvent) => void;
}

export function dropzone<T>(node: HTMLElement, options: DropzoneOptions<T>) {
    const defaultOptions: DropzoneOptions<T> = {
        dropEffect: 'copy',
        dragover_class: 'droppable',
        on_dropzone: () => { } // No-op default function
    };

    let state = { ...defaultOptions, ...options };

    function handle_dragenter(e: DragEvent) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.add(state.dragover_class || '');
        }
    }

    function handle_dragleave(e: DragEvent) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.remove(state.dragover_class || '');
        }
    }

    function handle_dragover(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = state.dropEffect || 'copy';
        }
    }

    function handle_drop(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer) {
            const data = e.dataTransfer.getData('text/plain');
            if (data) {
                try {
                    const parsedData = JSON.parse(data) as T;
                    if (state.on_dropzone) {
                        state.on_dropzone(parsedData, e);
                    }
                } catch (error) {
                    console.error('Error parsing dropped data:', error);
                }
            }
        }
    }

    node.addEventListener('dragenter', handle_dragenter);
    node.addEventListener('dragleave', handle_dragleave);
    node.addEventListener('dragover', handle_dragover);
    node.addEventListener('drop', handle_drop);

    return {
        update(newOptions: Partial<DropzoneOptions<T>>) {
            state = { ...state, ...newOptions };
        },
        destroy() {
            node.removeEventListener('dragenter', handle_dragenter);
            node.removeEventListener('dragleave', handle_dragleave);
            node.removeEventListener('dragover', handle_dragover);
            node.removeEventListener('drop', handle_drop);
        }
    };
}

```

### Define card interface in `$lib/index`

```js
export interface Card {
    id: number;
    content: string;
}
```

and exports for better file organization

```js
export { draggable } from './utils/drag-and-drop.ts';
export { dropzone } from './utils/drag-and-drop.ts';
```

## Now in +page.svelte (or in any component you want to implement drag and drop functionality)

### Imports necessary functions and types from `$lib/index`. draggable and dropzone are directives for handling drag-and-drop functionality. Card is a type definition for a card object.

```js
import { draggable, dropzone, type Card } from '$lib/index';
```

Defines an array of cards with IDs and content.

```js
let cards: Card[] = [
    { id: 1, content: 'Card 1' },
    { id: 2, content: 'Card 2' },
    { id: 3, content: 'Card 3' }
];
```

Initializes an empty array to store dropped cards.

```js
let droppedCards: Card[] = [];
```

Initializes a boolean variable to track the dragging state.

```js
    let isDragging: boolean = false;
```

Initializes a variable to keep track of the placeholder index for dragging.

```js
 let placeholderIndex: number | null = null;
```

Sets isDragging to true when dragging starts.

```js
    function handleDragStart(card: Card) {
        isDragging = true;
        draggedCard = card;
    }
```

Sets isDragging to false and clears the placeholder index when dragging ends.

```js
function handleDragEnd() {
	isDragging = false;
	draggedCard = null;
	placeholderIndex = null;
}
```

Handles the drop event. If placeholderIndex is set, the dropped card is inserted at the placeholder position. Otherwise, it is appended to the end of droppedCards. Resets the placeholder index after the drop.

```js
 function handleDrop(data: Card, event: DragEvent) {
        event.preventDefault();

        if (!draggedCard) return;

        if (placeholderIndex !== null) {
            // Remove the dragged card from its original position in the array if it exists
            const existingIndex = droppedCards.findIndex((card) => card.id === draggedCard!.id);
            if (existingIndex !== -1) {
                droppedCards.splice(existingIndex, 1);
            }

            // Insert the dragged card at the new position
            droppedCards = [
                ...droppedCards.slice(0, placeholderIndex),
                draggedCard,
                ...droppedCards.slice(placeholderIndex)
            ];
        } else {
            // Append the dragged card at the end if no placeholderIndex
            droppedCards = [...droppedCards, draggedCard];
        }

        // Reset drag-related state
        draggedCard = null;
        placeholderIndex = null;
        isDragging = false;
    }
```

Sets the placeholder index when hovering over a row, only if dragging is in progress.

```js
    function handleDragOver(event: DragEvent, index: number | null) {
        event.preventDefault();
        placeholderIndex = index;
    }
```

This is for delete model

```js
    function openDeleteModal(index: number) {
        showModal = true;
        cardToDelete = index;
    }

    function closeDeleteModal() {
        showModal = false;
        cardToDelete = null;
    }

    function confirmDelete() {
        if (cardToDelete !== null) {
            droppedCards = droppedCards.filter((_, i) => i !== cardToDelete);
        }
        closeDeleteModal();
    }
```

Creates a row of draggable cards using a loop. Each card has styles and events to handle dragging.

```html
<!-- Draggable Cards -->
<div class="flex space-x-4">
	{#each cards as card}
	<div
		class="cursor-grab rounded-md bg-blue-500 p-4 text-white shadow-md hover:bg-blue-600"
		draggable="true"
		role="button"
		tabindex="0"
		aria-grabbed="{isDragging}"
		on:dragstart="{()"
		=""
	>
		handleDragStart(card)} on:dragend={handleDragEnd} use:draggable={card} > {card.content}
	</div>
	{/each}
</div>
```

Creates a dropzone area for the cards. Changes border color when dragging. Uses the dropzone directive to handle drops.

```html
<!-- Dropzone -->
<div
	class="w-full max-w-3xl border-2 border-dashed border-gray-300 bg-gray-100 p-4 shadow-md transition-colors duration-300"
	class:!border-blue-500="{isDragging}"
	use:dropzone="{{"
	on_dropzone:
	handleDrop
	}}
></div>
```

> for Example refer this example code in this code first table view and then list view is created with basic CSS

```html
<script lang="ts">
	import { draggable, dropzone, type Card } from '$lib/index';

	let cards: Card[] = [
		{ id: 1, content: 'Card 1' },
		{ id: 2, content: 'Card 2' },
		{ id: 3, content: 'Card 3' }
	];

	let droppedCards: Card[] = [];
	let isDragging: boolean = false;
	let draggedCard: Card | null = null;
	let placeholderIndex: number | null = null;

	let showModal: boolean = false;
	let cardToDelete: number | null = null;

	// Handlers
	function handleDragStart(card: Card) {
		isDragging = true;
		draggedCard = card;
	}

	function handleDragEnd() {
		isDragging = false;
		draggedCard = null;
		placeholderIndex = null;
	}

	function handleDragOver(event: DragEvent, index: number | null) {
		event.preventDefault();
		placeholderIndex = index;
	}

	function handleDrop(data: Card, event: DragEvent) {
		event.preventDefault();

		if (!draggedCard) return;

		if (placeholderIndex !== null) {
			// Remove the dragged card from its original position in the array if it exists
			const existingIndex = droppedCards.findIndex((card) => card.id === draggedCard!.id);
			if (existingIndex !== -1) {
				droppedCards.splice(existingIndex, 1);
			}

			// Insert the dragged card at the new position
			droppedCards = [
				...droppedCards.slice(0, placeholderIndex),
				draggedCard,
				...droppedCards.slice(placeholderIndex)
			];
		} else {
			// Append the dragged card at the end if no placeholderIndex
			droppedCards = [...droppedCards, draggedCard];
		}

		// Reset drag-related state
		draggedCard = null;
		placeholderIndex = null;
		isDragging = false;
	}

	function openDeleteModal(index: number) {
		showModal = true;
		cardToDelete = index;
	}

	function closeDeleteModal() {
		showModal = false;
		cardToDelete = null;
	}

	function confirmDelete() {
		if (cardToDelete !== null) {
			droppedCards = droppedCards.filter((_, i) => i !== cardToDelete);
		}
		closeDeleteModal();
	}
</script>

<div class="flex flex-col items-center space-y-8 p-8">
	<!-- Draggable Cards -->
	<div class="flex space-x-4">
		{#each cards as card}
		<div
			class="cursor-grab rounded-md bg-blue-500 p-4 text-white shadow-md hover:bg-blue-600"
			draggable="true"
			role="button"
			tabindex="0"
			aria-grabbed="{isDragging}"
			on:dragstart="{()"
			=""
		>
			handleDragStart(card)} on:dragend={handleDragEnd} use:draggable={card} > {card.content}
		</div>
		{/each}
	</div>

	<!-- Drop Zone -->
	<div
		class="w-full max-w-3xl border-2 border-dashed border-gray-300 bg-gray-100 p-4 shadow-md transition-colors duration-300"
		class:!border-blue-500="{isDragging}"
		use:dropzone="{{"
		on_dropzone:
		handleDrop
		}}
	>
		<ul class="space-y-4">
			{#each droppedCards as card, i}
			<li
				class="flex items-center justify-between bg-white p-4 shadow hover:bg-gray-50"
				on:dragover="{(event)"
				=""
			>
				handleDragOver(event, i)} on:drop={(event) => handleDrop(card, event)} draggable="true"
				on:dragstart={() => handleDragStart(card)} on:dragend={handleDragEnd} >
				<span>{card.content}</span>
				<button class="delete-button" on:click="{()" ="">
					openDeleteModal(i)} aria-label="Delete card" > Delete
				</button>
			</li>
			{/each} {#if placeholderIndex !== null}
			<li class="opacity-50">Drop here</li>
			{/if} {#if droppedCards.length === 0 && placeholderIndex === null}
			<li>No cards dropped yet.</li>
			{/if}
		</ul>
	</div>

	<!-- Modal -->
	{#if showModal}
	<div
		class="fixed inset-0 z-50 m-0 flex items-center justify-center bg-gray-800 bg-opacity-75 p-0"
		aria-labelledby="delete-modal-title"
		role="dialog"
	>
		<div class="w-1/3 rounded-lg bg-white p-8 shadow-lg">
			<h2 id="delete-modal-title" class="text-lg font-bold">Delete Card</h2>
			<p class="mt-4">Are you sure you want to delete this card?</p>
			<div class="mt-6 flex justify-end space-x-4">
				<button
					class="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
					on:click="{closeDeleteModal}"
				>
					Cancel
				</button>
				<button
					class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
					on:click="{confirmDelete}"
				>
					Delete
				</button>
			</div>
		</div>
	</div>
	{/if}
</div>

<style>
	.delete-button {
		display: none;
		/* Adjust the styles as per your design */
	}
	li:hover .delete-button {
		display: block;
	}
</style>
```
