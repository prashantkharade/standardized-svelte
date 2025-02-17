<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { dropzone, draggable } from '../user/[userId]/question/drag-and-drop/dnd';

	export let cards = [
		{ id: 1, name: 'Text' },
		{ id: 2, name: 'Float' },
		{ id: 3, name: 'Integer' },
		{ id: 4, name: 'Boolean' },
		{ id: 5, name: 'Object' },
		{ id: 6, name: 'TextArray' },
		{ id: 7, name: 'SingleChoiceSelection' },
		{ id: 8, name: 'MultiChoiceSelection' },
		{ id: 9, name: 'File' },
		{ id: 10, name: 'Date' },
		{ id: 11, name: 'DateTime' },
		{ id: 12, name: 'Rating' },
		{ id: 13, name: 'Location' },
		{ id: 14, name: 'Range' },
		{ id: 15, name: 'None' }
	];

	let droppedCards: string | any[] = [];

	function handleDrop(card, event) {
		droppedCards = [...droppedCards, { ...card, id: droppedCards.length + 1 }];
	}
</script>

<div class="flex h-screen">
	<div class="w-1/3 overflow-y-auto bg-red-200 p-4" use:dropzone={{ on_dropzone: handleDrop }}>
		{#each cards as card}
			<div
				class="flex h-fit cursor-grab items-center justify-center"
				use:draggable={card}
			>
				<Button class="w-44 mb-5">{card.name}</Button>
			</div>
		{/each}
	</div>
	<div class="w-2/3 overflow-y-auto bg-slate-200 p-4" use:dropzone={{ on_dropzone: handleDrop }}>
		{#each droppedCards as card}
			<div class="mb-4 rounded border border-gray-200 bg-white p-4">
				<form>
					<div class="mb-2">
						<label class="block text-gray-700" for="firstname">Firstname:</label>
						<input type="text" class="w-full rounded border p-2" />
					</div>
					<div class="mb-2">
						<label class="block text-gray-700" for="lastname">Lastname:</label>
						<input type="text" class="w-full rounded border p-2" />
					</div>
					<div class="mb-2">
						<label class="block text-gray-700" for="phone">Phone:</label>
						<input type="text" class="w-full rounded border p-2" />
					</div>
					<div class="mb-2">
						<label class="block text-gray-700" for="email">Email:</label>
						<input type="text" class="w-full rounded border p-2" />
					</div>
				</form>
			</div>
		{/each}
	</div>
</div>

<style>
	.droppable {
		border: 2px dashed #000;
	}
</style>
