<script lang="ts">
    import { draggable, dropzone, type Card } from '$lib/index';
	import TryHelper from './try-helper.svelte';

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
                aria-grabbed={isDragging}
                on:dragstart={() => handleDragStart(card)}
                on:dragend={handleDragEnd}
                use:draggable={card}
            >
                {card.content}
            </div>
        {/each}
    </div>

    <!-- Drop Zone -->
    <div
        class="w-full max-w-3xl border-2 border-dashed border-gray-300 bg-gray-100 p-4 shadow-md transition-colors duration-300"
        class:!border-blue-500={isDragging}
        use:dropzone={{ on_dropzone: handleDrop }}
    >
        <ul class="space-y-4">
            {#each droppedCards as card, i}
                <li
                    class="flex items-center justify-between bg-white p-4 shadow hover:bg-gray-50"
                    on:dragover={(event) => handleDragOver(event, i)}
                    on:drop={(event) => handleDrop(card, event)}
                    draggable="true"
                    on:dragstart={() => handleDragStart(card)}
                    on:dragend={handleDragEnd}
                >
                    <span>{card.content}</span>
                    <button
                        class="delete-button"
                        on:click={() => openDeleteModal(i)}
                        aria-label="Delete card"
                    >
                        Delete
                    </button>
                </li>
            {/each}

            {#if placeholderIndex !== null}
                <li class="opacity-50">Drop here</li>
            {/if}

            {#if droppedCards.length === 0 && placeholderIndex === null}
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
                        on:click={closeDeleteModal}
                    >
                        Cancel
                    </button>
                    <button
                        class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        on:click={confirmDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- <style>
    .delete-button {
        display: none;
        /* Adjust the styles as per your design */
    }
    li:hover .delete-button {
        display: block;
    }
</style> -->


<TryHelper/>