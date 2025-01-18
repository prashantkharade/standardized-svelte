<!-- <script lang="ts">
    import { draggable, dropzone, type Card } from '$lib/index';

    let cards: Card[] = [
        { id: 1, content: 'Card 1' },
        { id: 2, content: 'Card 2' },
        { id: 3, content: 'Card 3' }
    ];

    let droppedCards: Card[] = [];
    let placeholderIndex: number | null = null;
    let isDragging = false;

    // For delete modal
    let deleteModalVisible = false;
    let cardToDeleteIndex: number | null = null;

    // View toggle
    let isListView = false;

    // Handle drag start
    function handleDragStart() {
        isDragging = true;
    }

    // Handle drag end
    function handleDragEnd() {
        isDragging = false;
        placeholderIndex = null;
    }

    // Handle drop
    function handleDragAndDrop(data: Card) {
        if (placeholderIndex !== null) {
            droppedCards = [
                ...droppedCards.slice(0, placeholderIndex),
                data,
                ...droppedCards.slice(placeholderIndex)
            ];
        } else {
            droppedCards = [...droppedCards, data];
        }
        placeholderIndex = null;
    }

    // Swap cards
    function swapCards(sourceIndex: number, destinationIndex: number) {
        const temp = droppedCards[sourceIndex];
        droppedCards[sourceIndex] = droppedCards[destinationIndex];
        droppedCards[destinationIndex] = temp;
    }

    // Handle row hover
    function handleRowHover(index: number) {
        if (isDragging) {
            placeholderIndex = index;
        }
    }

    // Clear placeholder on leave
    function clearPlaceholder() {
        placeholderIndex = null;
    }

    // Open delete modal
    function openDeleteModal(index: number) {
        deleteModalVisible = true;
        cardToDeleteIndex = index;
    }

    // Close delete modal
    function closeDeleteModal() {
        deleteModalVisible = false;
        cardToDeleteIndex = null;
    }

    // Confirm delete card
    function confirmDeleteCard() {
        if (cardToDeleteIndex !== null) {
            droppedCards = droppedCards.filter((_, i) => i !== cardToDeleteIndex);
        }
        closeDeleteModal();
    }
</script>
  -->

<!-- View Toggle -->
<!-- <div class="flex flex-col items-center space-y-8 p-8"> 
    <div class="flex space-x-4">
        <button
            class="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            on:click={() => (isListView = false)}
        >
            Grid View
        </button>
        <button
            class="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
            on:click={() => (isListView = true)}
        >
            List View
        </button>
    </div>-->

<!-- Draggable Cards -->
<!-- <div class="flex space-x-4">
        {#each cards as card}
            <div
                class="cursor-grab rounded-md bg-blue-500 p-4 text-white shadow-md hover:bg-blue-600"
                draggable="true"
                role="button"
                tabindex="0"
                aria-grabbed={isDragging}
                on:dragstart={handleDragStart}
                on:dragend={handleDragEnd}
                use:draggable={card}
            >
                {card.content}
            </div>
        {/each}
    </div> -->

<!-- Dropzone -->
<!-- <div
        class="w-full max-w-3xl border-2 border-dashed border-gray-300 bg-gray-100 p-4 shadow-md transition-colors duration-300"
        class:!border-blue-500={isDragging}
        use:dropzone={{ on_dropzone: handleDragAndDrop }}
    >
        {#if isListView} -->
<!-- List View -->
<!-- <ul class="space-y-4">
                {#each droppedCards as card, i}
                    <li
                        class="flex items-center justify-between bg-white p-4 shadow hover:bg-gray-50"
                        on:mouseenter={() => handleRowHover(i)}
                        on:mouseleave={clearPlaceholder}
                        draggable="true"
                        on:dragstart={() => handleDragStart()}
                        on:dragend={() => handleDragEnd()}
                        on:dragover={(e) => {
                            e.preventDefault();
                            handleRowHover(i);
                        }}
                        on:drop={() => swapCards(cardToDeleteIndex, i)}
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
        {:else} -->
<!-- Grid View (Table) -->
<!-- <table class="w-full table-auto border-collapse border border-gray-400">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="border border-gray-400 px-4 py-2">#</th>
                        <th class="border border-gray-400 px-4 py-2">Content</th>
                        <th class="border border-gray-400 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each droppedCards as card, i}
                        <tr
                            class="hover-container odd:bg-white even:bg-gray-50"
                            on:mouseenter={() => handleRowHover(i)}
                            on:mouseleave={clearPlaceholder}
                            draggable="true"
                            on:dragstart={() => handleDragStart()}
                            on:dragend={() => handleDragEnd()}
                            on:dragover={(e) => {
                                e.preventDefault();
                                handleRowHover(i);
                            }}
                            on:drop={() => swapCards(cardToDeleteIndex, i)}
                        >
                            <td class="border border-gray-400 px-4 py-2 text-center">{i + 1}</td>
                            <td class="border border-gray-400 px-4 py-2">{card.content}</td>
                            <td class="relative border border-gray-400 px-4 py-2 text-center">
                                <button
                                    class="delete-button"
                                    on:click={() => openDeleteModal(i)}
                                    aria-label="Delete card"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    {/each}

                    {#if placeholderIndex !== null}
                        <tr>
                            <td class="border border-gray-400 px-4 py-2 text-center opacity-50" colspan="3">
                                Drop here
                            </td>
                        </tr>
                    {/if}

                    {#if droppedCards.length === 0 && placeholderIndex === null}
                        <tr>
                            <td class="border border-gray-400 px-4 py-2 text-center" colspan="3">
                                No cards dropped yet.
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        {/if}
    </div> -->

<!-- Delete Modal -->
<!--  {#if deleteModalVisible}
        <div class="fixed h-full border inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div class="rounded bg-white p-6 shadow-lg">
                <h2 class="mb-4 text-lg font-semibold">Are you sure you want to delete this card?</h2>
                <div class="flex justify-end space-x-4">
                    <button
                        class="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        on:click={closeDeleteModal}
                    >
                        Cancel
                    </button>
                    <button
                        class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                        on:click={confirmDeleteCard}
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
        @apply hidden rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700;
    }

    .hover-container:hover .delete-button {
        @apply block;
    }
</style> -->

<script lang="ts">
	import { writable } from 'svelte/store';

	type Card = {
		id: number; // Unique ID
		content: string;
	};

	let cards = writable<Card[]>([
		{ id: 1, content: 'Card 1' },
		{ id: 2, content: 'Card 2' },
		{ id: 3, content: 'Card 3' }
	]);

	let dragIndex: number | null = null;
	let placeholderIndex: number | null = null;

	function handleDragStart(event: DragEvent, index: number) {
		dragIndex = index;
		event.dataTransfer?.setData('text/plain', `${index}`);
		event.dataTransfer?.setDragImage(document.createElement('div'), 0, 0); // Hide default preview
	}

	function handleDragOver(event: DragEvent, index: number | null) {
		event.preventDefault();
		placeholderIndex = index;
	}

	function handleDragEnd() {
		dragIndex = null;
		placeholderIndex = null;
	}

	function handleDrop(event: DragEvent, index: number | null) {
		event.preventDefault();

		if (dragIndex === null) return;

		cards.update((currentCards) => {
			const draggedCard = currentCards[dragIndex];
			const updatedCards = [...currentCards];

			// Remove dragged card from its original position
			updatedCards.splice(dragIndex, 1);

			// Insert dragged card at the new position
			if (index !== null) {
				updatedCards.splice(index, 0, draggedCard);
			} else {
				updatedCards.push(draggedCard);
			}

			return updatedCards;
		});

		dragIndex = null;
		placeholderIndex = null;
	}
</script>

<div class="flex flex-col items-center space-y-8 p-8">
	<!-- Card List -->
	<div
		class="w-full max-w-3xl border-2 border-dashed border-gray-300 bg-gray-100 p-4 shadow-md"
		on:dragend={handleDragEnd}
	>
		<ul class="space-y-4">
			{#each $cards as card, i}
				<!-- Blue Line Placeholder -->
				{#if placeholderIndex === i}
					<li class="drag-placeholder"></li>
				{/if}

				<!-- Draggable Card -->
				<li
					class="cursor-grab rounded-md bg-white p-4 shadow hover:bg-gray-50"
					draggable="true"
					on:dragstart={(event) => handleDragStart(event, i)}
					on:dragover={(event) => handleDragOver(event, i)}
					on:drop={(event) => handleDrop(event, i)}
				>
					{card.content}
				</li>
			{/each}

			<!-- Add Placeholder at End if Necessary -->
			{#if placeholderIndex === $cards.length}
				<li class="drag-placeholder"></li>
			{/if}
		</ul>
	</div>
</div>

<style>
	.drag-placeholder {
		height: 2px;
		background-color: #3b82f6; /* Blue line for drop indicator */
		margin: 4px 0;
	}
</style>
