<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { questionSchema, type QuestionSchema } from './question-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button';

	export let data: SuperValidated<Infer<QuestionSchema>>;

	const form = superForm(data, {
		validators: zodClient(questionSchema)
	});

	const { form: formData, enhance } = form;
	export let parentsections;
	let responseType: string;
	export let handleSubmit;

	function handleChange(event) {
		responseType = event.target.value;
	}

	$: console.log('response type is: ', responseType);

	let options: any[] = [];

	function addOption() {
		options = [...options, ''];
	}

	function updateOption(index: number, value: any) {
		options[index] = value;
		options = [...options];
	}

	function removeOption(index: number) {
		options = options.filter((_, i) => i !== index);
	}

</script>

<!-- <div class="relative rounded-xl shadow-xl shadow-black "> -->
<!-- <form
	action="?/createQuestion"
	method="POST"
	use:enhance
	class="custom-scrollbar h-[80vh] w-[92vh] overflow-y-auto rounded-md  px-5 py-4"
> -->
	<!-- <div class="mb-4 flex justify-end">
		<Button type="button" class="btn btn-secondary" on:click={handleCancel}>Cancel</Button>
	</div> -->

	<Form.Field {form} name="parentSectionId">
		<Form.Control let:attrs>
			<Form.Label>Parent Section Id</Form.Label>
			<Select.Root portal={null} name="parentSectionId">
				<Select.Trigger class="w-full">
					<Select.Value placeholder="Select a Parent Section Id" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Sections</Select.Label>
						{#each parentsections as s}
							<Select.Item value={s.id}>{s.Title} - {s.DisplayCode}</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
				<Select.Input name="parentSectionId" />
			</Select.Root>
		</Form.Control>
		<Form.Description>
			You can manage email addresses in your <a href="/examples/forms">email settings</a>.
		</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="title">
		<Form.Control let:attrs>
			<Form.Label>Title</Form.Label>
			<Input {...attrs} bind:value={$formData.title} class="w-full" />
		</Form.Control>
		<Form.Description>This is your question title.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Description</Form.Label>
			<Input {...attrs} bind:value={$formData.description} class="w-full" />
		</Form.Control>
		<Form.Description>This is your question description.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="responseType">
		<Form.Control let:attrs>
			<Form.Label>Response Type</Form.Label>
			<Input {...attrs} bind:value={$formData.responseType} class="w-full" />

			<!-- <select
				required
				class="select h-12 w-full rounded-xl border-2 p-2 pl-4 text-slate-500"
				name="responseType"
				on:change={handleChange}
			>
				<option value="Text">Text</option>
				<option value="Float">Float</option>
				<option value="Integer">Integer</option>
				<option value="Boolean">Boolean</option>
				<option value="SingleChoiceSelection">Single choice</option>
				<option value="MultiChoiceSelection">Checkbox</option>
				<option value="SingleChoiceSelection">Drop-down</option>
				<option value="Date">Date</option>
				<option value="DateTime">DateTime</option>
				<option value="Rating">Rating</option>
				<option value="Range">Range</option>
				<option value="None">None</option>
			</select> -->
		</Form.Control>
		<Form.Description>Choose the type of response expected for this question.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	{#if responseType === 'Range' || responseType === 'Rating'}
		<Form.Field {form} name="rangeMin">
			<Form.Control let:attrs>
				<Form.Label>Minimum Range</Form.Label>
				<Input {...attrs} bind:value={$formData.rangeMin} class="w-full" />
			</Form.Control>
			<Form.Description>Set the minimum value for the range.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="rangeMax">
			<Form.Control let:attrs>
				<Form.Label>Maximum Range</Form.Label>
				<Input {...attrs} bind:value={$formData.rangeMax} class="w-full" />
			</Form.Control>
			<Form.Description>Set the maximum value for the range.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	{:else if responseType === 'SingleChoiceSelection' || responseType === 'MultiChoiceSelection' || responseType === 'Boolean'}
		<Button type="button" on:click={addOption} class="btn btn-primary mb-4">Add Option</Button>

		{#each options as option, index}
			<div class="mb-2 flex items-center">
				<Input
					type="text"
					name={`options[${index}]`}
					value={option}
					on:input={(e) => updateOption(index, e.target.value)}
					placeholder={`Option ${index + 1}`}
					class="flex-1"
				/>
				<button type="button" on:click={() => removeOption(index)} class="ml-2">
					<svg
						class="h-6 w-6 text-red-500"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<line x1="4" y1="7" x2="20" y2="7" />
						<line x1="10" y1="11" x2="10" y2="17" />
						<line x1="14" y1="11" x2="14" y2="17" />
						<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
						<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
					</svg>
				</button>
			</div>
		{/each}
	{:else if !responseType}
		<div class="text-center text-red-500">No type selected.</div>
	{/if}

	<Form.Field {form} name="score">
		<Form.Control let:attrs>
			<Form.Label>Score</Form.Label>
			<Input {...attrs} bind:value={$formData.score} class="w-full" />
		</Form.Control>
		<Form.Description>This is the score for this question.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="correctAnswer">
		<Form.Control let:attrs>
			<Form.Label>Correct Answer</Form.Label>
			<Input {...attrs} bind:value={$formData.correctAnswer} class="w-full" />
		</Form.Control>
		<Form.Description>Correct answer for the question.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="hint">
		<Form.Control let:attrs>
			<Form.Label>Hint</Form.Label>
			<Input {...attrs} bind:value={$formData.hint} class="w-full" />
		</Form.Control>
		<Form.Description>Hint for this question.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="questionImageUrl">
		<Form.Control let:attrs>
			<Form.Label>Question Image URL</Form.Label>
			<Input {...attrs} bind:value={$formData.questionImageUrl} class="w-full" />
		</Form.Control>
		<Form.Description>This is the image URL for the question.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Button type="submit" class="mx-auto mt-5 w-full" on:click={handleSubmit}>Add Question</Button>
<!-- </form> -->
<!-- </div> -->

<!-- <form action="?/createQuestion" method="post" use:enhance class="w-full">
				<table class="mt-[10px] table w-full">
					<tbody>
						{#each templateInfo as templateInfo}
							
					
						<tr>
							<td colspan="2" class="h-12 rounded-md text-center text-2xl font-bold text-slate-700">
								<div
									class="border-1 relative mx-auto h-fit rounded-md border-black bg-gradient-to-r from-violet-500 to-purple-900 text-white pb-7"
								>
									<h1 class="absolute right-2 top-2 mr-0 mt-0 text-2xl font-semibold">
										{templateInfo.Type}
									</h1>
									<div class="flex h-full flex-col items-center justify-center">
										<h2 class="mt-5 text-center text-3xl font-bold">
											{templateInfo.Title}
										</h2>
										<div class="mt-2 flex w-full flex-row justify-center">
											<p class="ml-auto text-sm">
												{templateInfo.Description}
											</p>
											<p class="ml-auto mr-2 text-sm">
												Version: {templateInfo.CurrentVersion}
											</p>
										</div>
									</div>
								</div>
							</td>
						</tr>
						{/each}
						<tr>
							<td>
								<h1 class="ml-10 text-lg font-bold text-slate-700">Add Title of Question ?</h1>
							</td>
							<td class="py-2">
								<input
									required
									type="text"
									name="title"
									placeholder="Add your question ?"
									class="ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4 focus:border-blue-300 focus:outline-none focus:ring"
								/>
							</td>
						</tr>

						<tr class="">
							<td>
								<h1 class="ml-10 text-lg font-bold text-slate-700">Enter Description here...</h1>
							</td>
							<td class="py-2">
								<textarea
									name="description"
									placeholder="Enter description here..."
									class="input ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4"
								/>
							</td>
						</tr>

						<tr class="">
							<td>
								<h1 class="ml-10 text-lg font-bold text-slate-700">
									Select Parent Section here...
								</h1>
							</td>
							<td class="py-2">
								<select
									name="parentSectionId"
									class="select ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4 text-slate-500"
									placeholder="Select parent section"
								>
									{#each section as s}
										<option value={s.id} class="rounded-xl border border-y-black text-slate-500">
											{s.Title} - {s.DisplayCode}</option
										>
									{/each}
								</select>
							</td>
						</tr>

						<tr class="">
							<td
								><h1 class="ml-10 text-lg font-bold text-slate-700">
									Enter Question Response Type..
								</h1></td
							>
							<td class="py-2">
								<select
									required
									class="select ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4 text-slate-500"
									name="responseType"
									on:change={handleChange}
								>
									<option value="Text">Text</option>
									<option value="Float">Float</option>
									<option value="Integer">Integer</option>
									<option value="Boolean">Boolean</option>
									<option value="SingleChoiceSelection">Single choice</option>
									<option value="MultiChoiceSelection">Checkbox</option>
									<option value="SingleChoiceSelection">Drop-down</option>
									<option value="Date">Date</option>
									<option value="DateTime">DateTime</option>
									<option value="Rating">Rating</option>
									<option value="Range">Range</option>
									<option value="None">None</option>
								</select>
							</td>
						</tr>

						<tr class="">
							<td><h1 class="ml-10 text-lg font-bold text-slate-700">Score</h1></td>
							<td class="py-2">
								<input
									placeholder="Enter Score for the question"
									type="number"
									name="score"
									class="input ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4"
								/>
							</td>
						</tr>

						<tr>
							<td
								><h1 class="ml-10 text-lg font-bold text-slate-700">
									Enter Correct Answer here..
								</h1></td
							>
							<td class="py-2"
								><input
									type="text"
									name="correctAnswer"
									placeholder="Enter Correct answer here..."
									class="input ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4"
								/></td
							>
						</tr>

						<tr>
							<td><h1 class="ml-10 text-lg font-bold text-slate-700">Enter Hint</h1></td>
							<td class="py-2"
								><input
									type="text"
									name="hint"
									placeholder="Hint..."
									class="input ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4"
								/></td
							>
						</tr>

						<tr class="">
							<td><h1 class="ml-10 text-lg font-bold text-slate-700">Question Image URL</h1></td>
							<td class="py-2">
								<input
									placeholder="Enter Question Image URL"
									type="text"
									name="questionImageUrl"
									class="input ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4"
								/>
							</td>
						</tr>

						{#if queryType === 'Range' || queryType === 'Rating'}
							<tr class="">
								<td><h1 class="ml-10 text-lg font-bold text-slate-700">Range Min</h1></td>
								<td class="py-2">
									<input
										placeholder="Enter minimum range"
										type="number"
										name="rangeMin"
										class="input ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4"
									/>
								</td>
							</tr>

							<tr class="">
								<td><h1 class="ml-10 text-lg font-bold text-slate-700">Range Max</h1></td>
								<td class="py-2">
									<input
										placeholder="Enter maximum range"
										type="number"
										name="rangeMax"
										class="input ml-[1%] h-12 w-[90%] rounded-xl border-2 p-2 pl-4"
									/>
								</td>
							</tr>
							
						{:else if queryType === 'SingleChoiceSelection' || queryType === 'MultiChoiceSelection' || queryType === 'Boolean'}
							<tr class="m-4 h-fit w-[1000px] p-2">
								<td>
									<button
										type="button"
										on:click={addOption}
										value="Add more"
										class=" ml-10 h-fit w-fit rounded-md bg-gradient-to-r from-violet-500 to-purple-900 border-2 p-2 text-white">Add Options</button
									>
								</td>
								<td>
									{#each options as option, index}
										<div class="flex w-[90%] flex-row p-3">
											<input
												type="text"
												name={`options`}
												value={option}
												on:input={(e) => updateOption(index, e.target.value)}
												placeholder={`Option ${index + 1}`}
												class="input ml-[1%] h-12 w-full rounded-xl border-2 p-2 pl-4"
											/>

											<button
												class="ml-20 mt-[8px] w-[10%]"
												type="button"
												value="remove"
												on:click={() => removeOption(index)}
											>
												<svg
													class="h-6 w-6 text-red-500"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													fill="none"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<path stroke="none" d="M0 0h24v24H0z" />
													<line x1="4" y1="7" x2="20" y2="7" />
													<line x1="10" y1="11" x2="10" y2="17" />
													<line x1="14" y1="11" x2="14" y2="17" />
													<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
													<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg
												>
											</button>
										</div>
									{/each}</td
								>
							</tr>
						{:else if !queryType}
							<tr class="text-center text-red-500"><td>No type selected.</td></tr>
						{/if}
					</tbody>
				</table>

				<div class="flex justify-end">
					<button
						type="submit"
						class="relative items-end h-10 w-32 rounded border-r-2 bg-gradient-to-r from-violet-500 to-purple-900 text-white"
						>Add Question</button
					>
				</div>
			</form>-->

<!-- <style>
	.form-container {
		max-height: 90vh;
		overflow-y: auto;
	}
</style> -->

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
