<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { assessmentSchema, type AssessmentSchema } from './assessment-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { createEventDispatcher } from 'svelte';

	export let data: SuperValidated<Infer<AssessmentSchema>>;

	const form = superForm(data, {
		validators: zodClient(assessmentSchema)
	});

	const { form: formData, enhance } = form;

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
	action="?/newAssessment"
	method="POST"
	use:enhance
	class="m-5 mx-auto max-h-[95vh] w-[100vh] overflow-y-auto bg-[#EEEEEE] p-10"
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

	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Input {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.Description>This is Description for section.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="type">
		<Form.Control let:attrs>
			<Form.Label>Type</Form.Label>
			<Select.Root portal={null} name="type">
				<Select.Trigger>
					<Select.Value placeholder="Select Type of template " />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="Survey" label="Survey" />
					<Select.Item value="Questionnaire" label="Questionnaire" />
					<Select.Item value="TestPaper" label="TestPaper" />
					<Select.Item value="DataCollection" label="DataCollection" />
				</Select.Content>
				<Select.Input name="parentSectionId" />
			</Select.Root>
		</Form.Control>
		<Form.Description>This is parent section for section.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="currentVersion">
		<Form.Control let:attrs>
			<Form.Label>Current Version</Form.Label>
			<Input {...attrs} bind:value={$formData.currentVersion} />
		</Form.Control>
		<Form.Description>This is Section identifier.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field
		{form}
		name="defaultSectionNumbering"
		class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
	>
		<Form.Control let:attrs>
			<Checkbox {...attrs} bind:checked={$formData.defaultSectionNumbering} />
			<div class="space-y-1 leading-none">
				<Form.Label>Default Section Numbering</Form.Label>
				<Form.Description>
					You can manage your mobile notifications in the <a href="/examples/forms"
						>mobile settings</a
					> page.
				</Form.Description>
			</div>
			<input name={attrs.name} value={$formData.defaultSectionNumbering} hidden />
		</Form.Control>
	</Form.Field>
	<Button type="submit" class="mx-auto mt-5 w-full">Submit</Button>
</form>

<!-- <div class=" w-9/12 rounded-md bg-slate-200 text-black shadow-xl px-10 py-10">
    <form method="post" action="?/new" class="space-y-4">
        <h1
            class="rounded-md bg-gradient-to-r from-violet-500 to-purple-900 p-2 text-center text-2xl font-bold text-white"
        >
            Create Assessment Template
        </h1>

        <label for="title" class="text-md mt-5 block">Title</label>
        <input
            type="text"
            name="title"
            required
            placeholder="Enter title here..."
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-300 focus:outline-none focus:ring"
        />

        <label for="description" class="text-md my-5 block">Description</label>
        <textarea
            name="description"
            placeholder="Enter description here..."
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-300 focus:outline-none focus:ring"
        ></textarea>

        <label for="type" class="text-md block">Type</label>
        <select
            required
            name="type"
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-300 focus:outline-none focus:ring"
        >
            <option value="Survey">Survey</option>
            <option value="Questionnaire">Questionnaire</option>
            <option value="TestPaper">TestPaper</option>
            <option value="DataCollection">DataCollection</option>
        </select>

        <label for="currentVersion" class="text-md block">Current Version</label>
        <input
            type="text"
            name="currentVersion"
            placeholder="Enter Display Code here"
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-300 focus:outline-none focus:ring"
        />

        <label for="defaultSectionNumbering" class="text-md block">Default Section Numbering</label>
        <input type="checkbox" name="defaultSectionNumbering" class="mx-5 my-4" />

        <div class="flex justify-end">
            <button
                type="submit"
                class="mt-8 rounded-md bg-gradient-to-r from-violet-500 to-purple-900 px-6 py-2 text-white hover:bg-violet-100"
                >Add Form / Edit Form</button
            >
        </div>
    </form>
</div>

 -->
