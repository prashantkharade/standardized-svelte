<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { sectioSchema, type SectioSchema } from './question/section-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	export let data: SuperValidated<Infer<SectioSchema>>;

	const form = superForm(data, {
		validators: zodClient(sectioSchema)
	});

	const { form: formData, enhance } = form;
	export let parentsections;
	///////////////////////////////////////////////////////////////
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleSubmit(event) {
		event.preventDefault();
		// Handle section form submission logic here
		dispatch('close');
	}

	function handleCancel() {
		dispatch('close');
	}
</script>

<form
	action="?/createSection"
	on:submit={handleSubmit}
	method="POST"
	use:enhance
	class="m-5 mx-auto bg-[#EEEEEE] p-10 max-h-[80vh] w-[100vh] custom-scrollbar"
>
	<div class="flex justify-end">
		<Button type="button" class="btn btn-secondary" on:click={handleCancel}>Cancel</Button>
	</div>

	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} />
		</Form.Control>
		<Form.Description>This is title of section.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="parentSectionId">
		<Form.Control let:attrs>
			<Form.Label>parentSectionId</Form.Label>
			<Select.Root portal={null} name="parentSectionId">
				<Select.Trigger>
					<Select.Value placeholder="Select Parent Section " />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Parent Sections</Select.Label>
						{#each parentsections as s}
							<Select.Item value={s.id}>{s.Title} - {s.DisplayCode}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="parentSectionId" />
			</Select.Root>
		</Form.Control>
		<Form.Description>This is parent section for section.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Input {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.Description>This is Description for section.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="sectionIdentifier">
		<Form.Control let:attrs>
			<Form.Label>SectionIdentifier</Form.Label>
			<Input {...attrs} bind:value={$formData.sectionIdentifier} />
		</Form.Control>
		<Form.Description>This is Section identifier.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="sequence">
		<Form.Control let:attrs>
			<Form.Label>Sequence</Form.Label>
			<Input {...attrs} bind:value={$formData.sequence} />
		</Form.Control>
		<Form.Description>This is Sequence of section.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button class="mx-auto mt-5 w-full">Submit</Form.Button>
</form>
<style>
	.custom-scrollbar {
		overflow-y: auto;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 0;
		background: transparent;
	}

	.custom-scrollbar {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: transparent;
	}
</style>
<!-- 	<form action="?/createSection" method="post" use:enhance class="w-full">
					<div class="mt-[10px] w-full">

						<div class="py-2">
							<label for="title" class="ml-10 text-lg font-bold text-slate-700">Sectio Name</label>
							<input
								required
								type="text"
								name="title"
								placeholder="Add your title ?"
								class="input ml-[1%] h-9 w-[90%] rounded-md border-2 p-2 pl-4"
							/>
						</div>

						<div class="py-2">
							<label for="description" class="ml-10 text-lg font-bold text-slate-700"
								>Enter Description for section</label
							>
							<textarea
								name="description"
								placeholder="Enter description here..."
								class="input ml-[1%] h-9 w-[90%] rounded-md border-2 p-2 pl-2"
							></textarea>
						</div>

						<div class="py-2">
							<label for="sequence" class="ml-10 text-lg font-bold text-slate-700"
								>Sequence of section</label
							>
							<input
								placeholder="Enter Sequesnce of section"
								type="number"
								name="sequence"
								class="input ml-[1%] h-9 w-[90%] rounded-md border-2 p-2 pl-4"
							/>
						</div>

						<div class="py-2">
							<label for="identifier" class="ml-10 text-lg font-bold text-slate-700"
								>Section Identifier</label
							>
							<input
								type="text"
								name="sectionIdentifier"
								placeholder="Enter Section identifier"
								class="input ml-[1%] h-9 w-[90%] rounded-md border-2 p-2 pl-4"
							/>
						</div>
					</div>

					<label for="parentSection" class="ml-10 text-lg font-bold text-slate-700"
						>Select Parent Section here...</label
					>

					<select
						name="parentSectionId"
						class="select mb-5 ml-[1%] h-10 w-[90%] rounded-md border-2 p-2 pl-4"
						placeholder="Select parent section"
					>
						{#each section as s}
							<option value={s.id} class="rounded-md border border-y-black">
								{s.Title} - {s.DisplayCode}</option
							>
						{/each}
					</select>

					<div class="flex justify-end">
						<button
							type="submit"
							class="relative items-end h-10 w-32 rounded border-r-2 bg-gradient-to-r from-violet-500 to-purple-900 text-white"
							>Add Section</button
						>
					</div>
				</form>-->
