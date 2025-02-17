<script lang="ts">
	import { X } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { PageServerData } from './$types';
	import Icon from '@iconify/svelte';
	import { page } from '$app/stores';
	import { dropzone, draggable } from './drag-and-drop/dnd';
	import QuestionForm from './question-form.svelte';
	import { invalidate } from '$app/navigation';
	import * as Sheet from '$lib/components/ui/sheet/index.js';

	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import chalk from 'chalk';

	export let cards = [
		{ id: 1, name: 'Text' },
		{ id: 2, name: 'Float' },
		{ id: 3, name: 'Integer' },
		{ id: 4, name: 'Boolean' },
		{ id: 5, name: 'Object' },
		{ id: 6, name: 'TextArray' },
		{ id: 7, name: 'Radio' },
		{ id: 8, name: 'Checkbox' },
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

	/////////////////////////////////////////////////////////////////////////////////////
	export let data: PageServerData;
	$: section = data.sections;
	$: questionList = data.assessmentNodes;
	const templateId = $page.params.assessmentId;
	const userId = $page.params.userId;
	const templateInfo = data.assessmentTemplate;

	let queryType: string;

	function handleChange(event) {
		queryType = event.target.value;
	}

	const handleDelete = async (e, id: any) => {
		const questionId = id;
		await Delete({
			questionId: questionId
		});
		invalidate('app:allNodes');
	};

	async function Delete(model: { questionId: any }) {
		console.log(model);
		const response = await fetch(`/api/server`, {
			method: 'DELETE',
			body: JSON.stringify(model),
			headers: { 'content-type': 'application/json' }
		});
	}

	////////////////////////////////////////////////////////////////////////////////////

	let response;
	let submissionId: unknown;

	if (submissionId) {
	}
	$: link = `http://localhost:5173/form/submission/${submissionId}`;

	const createLink = async (templateId: string) => {
		const parenttemplateId = templateId;
		response = await Submission({
			templateId: parenttemplateId
		});
		submissionId = response.Data.id;
		invalidate('app:allNodes');
	};

	async function Submission(model: { templateId: string }) {
		const response = await fetch(`/api/server/submission`, {
			method: 'POST',
			body: JSON.stringify(model),
			headers: { 'Content-Type': 'application/json' }
		});
		const responseData = await response.json();
		return responseData;
	}

	function copyToClipboard() {
		console.log(chalk.hex('#f3fa00')(JSON.stringify('button clicked')));
		const tempInput = document.createElement('textarea');
		tempInput.value = link;
		document.body.appendChild(tempInput);
		tempInput.select();
		document.execCommand('copy');
		document.body.removeChild(tempInput);
	}

	//////////////////////////////////////////////////////////////////////////////////////
	let showSectionForm = false;
	let showQuestionForm = false;

	function openSectionForm() {
		showSectionForm = true;
	}

	function openQuestionForm() {
		showQuestionForm = true;
	}

	function closeForms() {
		showSectionForm = false;
		showQuestionForm = false;
	}

	function openLink() {
		const url = link; // Replace with your link
		window.open(url, '_blank');
	}

	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let showSheet = false;

	function openSheet() {
		showSheet = true;
	}

	function closeSheet() {
		showSheet = false;
	}

	function handleSubmit(event) {
		event.preventDefault();
		// Handle form submission logic here
		closeSheet();
	}

	let typeOfQuestion: any;
	function changeTypes(e) {
		console.log(e.target.innerHTML);
		typeOfQuestion = e.target.innerHTML;
	}
	let buttons = [
		'Button 1',
		'Button 2',
		'Button 3',
		'Button 4',
		'Button 5',
		'Button 6',
		'Button 7',
		'Button 8'
	];
</script>

<div class="flex min-h-screen flex-col">
	<div class="flex flex-1 overflow-hidden">
		<!-- Dragzone: Sticky with buttons -->
		<div class="sticky top-0 h-[100vh] w-3/12 overflow-hidden border">
			<div class="flex flex-row space-x-2 border p-4">
				<button class="w-[50%]" on:click={changeTypes}>Basic</button>
				<button class="w-[50%]" on:click={changeTypes}>Advance</button>
			</div>

			<div
				class="flex h-[calc(100vh-3rem)] items-start justify-start p-2"
				use:dropzone={{ on_dropzone: handleDrop }}
			>
				<div class="grid grid-cols-2 gap-x-2 gap-y-2">
					{#if typeOfQuestion === 'Advance'}
						{#each buttons as button}
							<div
								class="flex h-fit cursor-grab items-center justify-center"
								use:draggable={button}
							>
								<Button class="w-44" variant="secondary">{button}</Button>
							</div>
						{/each}
					{:else}
						{#each cards as card}
							<div class="flex h-fit cursor-grab items-center justify-center" use:draggable={card}>
								<Button class="w-44" variant="secondary">{card.name}</Button>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<div class="mx-8 my-4 w-8/12 space-y-2 border-2 p-4" use:dropzone={{ on_dropzone: handleDrop }}>
			{#each droppedCards as card}
				<div class="relative">
					{#if card.name == 'Text'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'Integer'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'Float'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'Boolean'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'Object'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'TextArray'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'SingleChoiceSelection'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'MultiChoiceSelection'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'File'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'Date'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'DateTime'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'Rating'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'Location'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'Range'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{:else if card.name == 'None'}
						<div class="relative">
							<button
								class="flex h-fit w-full flex-col space-y-4 rounded-lg border border-dashed p-6 hover:border-dashed hover:border-gray-500"
								on:click={openSheet}
							>
								<div class="flex w-full items-center justify-between">
									<h1 class="text-xl font-bold">Title</h1>
									<p class="relative left-1">Score</p>
								</div>
								<div class=" w-full">
									<input type="text" class="w-full rounded border p-2" disabled />
								</div>
								<div>
									<p>Description</p>
								</div>
							</button>
							{#if showSheet}
								<button
									class="blur-background fixed inset-0 z-40 bg-black bg-opacity-10"
									on:click={closeSheet}
									on:keydown={(e) => e.key === 'Escape' && closeSheet()}
									aria-label="Close sheet"
								></button>

								<div
									class="fixed right-0 top-0 z-50 h-full w-[46%] overflow-y-auto rounded-sm bg-white shadow-lg"
									in:fly={{ x: 500, duration: 300 }}
									out:fly={{ x: 500, duration: 300 }}
									role="dialog"
									aria-modal="true"
								>
									<!-- <form on:submit={handleSubmit} class="space-y-4 p-1"> -->
									<div class="flex items-center justify-between bg-black px-5 py-1">
										<h2 class="text-md text-white">Form Title</h2>
										<button
											type="button"
											on:click={closeSheet}
											class="p-2 text-red-500 hover:bg-black"><X /></button
										>
									</div>

									<!-- Add your form fields here -->
									<form
										action="?/createQuestion"
										method="POST"
										use:enhance
										class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md px-5 py-4"
									>
										<QuestionForm
											data={data.questionForm}
											parentsections={section}
											on:close={closeForms}
											{handleSubmit}
										/>

										<!-- Add more form fields as needed -->

										<div class="mt-5 flex justify-end">
											<button
												type="submit"
												class="rounded bg-blue-500 p-2 text-white"
												on:click={handleSubmit}>Submit</button
											>
										</div>
									</form>
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #888;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
</style>
