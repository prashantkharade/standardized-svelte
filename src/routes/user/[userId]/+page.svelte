<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import Navbar from '$lib/components/navbar.svelte';
	import Icon from '@iconify/svelte';
	import DataTable from './data-table/data-table.svelte';
	import type { PageServerData } from './$types';
	import { page } from '$app/stores';
	import AssessmentForm from './assessment-form.svelte';

	//////////////////////////////////////////////////////////////////////

	export let data: PageServerData;
	const assessments = data.assessmentTemplate;
	console.log(assessments, 'This is data from new');
	let userId = $page.params.userId;
	var systemName = 'Form Builder and sharing service';

	/////////////////////////////////////////////////////
	let openAssessmentForm = false;
	function openAssessment() {
		openAssessmentForm = true;
	}

	function closeForms() {
		openAssessmentForm = false;
	}

	///////////////////////////////////////////////////////////////////////////

	let forms = false;
	function formsOnSlider() {
		forms = !forms;
	}
</script>

<svelte:head>
	<title>{systemName}</title>
	<meta name="description" content="Form Service" />
</svelte:head>

<Navbar></Navbar>
<div class="flex h-[95vh] w-full flex-row">
	<!-- <div class="flex flex-col space-y-2">
			<Button class="rounded" on:click={formsOnSlider}>Forms</Button>
			<Button class="rounded" on:click={formsOnSlider}>Responses</Button>
			<Button class="rounded">Tasks</Button>
		</div>
		<div class="mt-auto flex flex-col space-y-2">
			<Button class="rounded ">User Guide</Button>
			<Button class="rounded ">Settings</Button>
		</div> -->
	<div class="flex h-full w-fit flex-col justify-between border p-1">
		<div class="flex flex-col space-y-2">
			<Button
				class=" bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
				on:click={formsOnSlider}>Forms</Button
			>
			<Button
				class=" bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
				on:click={formsOnSlider}>Responses</Button
			>
			<Button
				class=" bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
				>Tasks</Button
			>
		</div>
		<div class="mt-auto flex flex-col space-y-2">
			<Button
				class=" bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
				>User Guide</Button
			>
			<Button
				class=" bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
				>Settings</Button
			>
		</div>
	</div>

	<div class="h-full w-fit">
		<!-- Content goes here -->
		<!-- {#if forms}
			<div class="flex h-full w-fit flex-col justify-between p-4">
				<div class="flex flex-col space-y-2">
					<Button class=" flex justify-start">
						<Icon
							class="text-left dark:text-black"
							icon="simple-icons:googleforms"
							width="20"
							height="20"
						/>
						<p class=" px-2 text-left">My Forms</p>
					</Button>
					<Button class=" flex items-center justify-start">
						<Icon
							class="dark:text-black"
							icon="fluent-mdl2:text-document-shared"
							width="20"
							height="20"
						/>
						<p class=" px-2">Shared forms</p>
					</Button>
					<Button class=" flex items-center justify-start">
						<Icon class="dark:text-black" icon="carbon:deploy-rules" width="20" height="20" />
						<p class=" px-1">Deployed forms</p>
					</Button>
					<Button class=" flex items-center justify-start">
						<Icon class="dark:text-black" icon="ph:folder-fill" width="20" height="20" />
						<p class="px-2">Folder's</p></Button
					>
				</div>
				<Button class="mb-3 flex items-center justify-start">
					<Icon class="dark:text-black " icon="ci:trash-full" width="20" height="20" />
					<p class="px-2">Trash</p>
				</Button>
			</div>
		{/if} -->
		<div class="h-full w-fit">
			<!-- Content goes here -->
			{#if forms}
				<div class="flex h-full w-fit flex-col justify-between p-4">
					<div class="flex flex-col space-y-2">
						<Button
							class=" flex justify-start bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
						>
							<Icon
								class="text-left dark:text-white"
								icon="simple-icons:googleforms"
								width="20"
								height="20"
							/>
							<p class=" px-2 text-left">My Forms</p>
						</Button>
						<Button
							class=" flex items-center justify-start bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
						>
							<Icon class="" icon="fluent-mdl2:text-document-shared" width="20" height="20" />
							<p class=" px-2">Shared forms</p>
						</Button>
						<Button
							class=" flex items-center justify-start bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
						>
							<Icon class="" icon="carbon:deploy-rules" width="20" height="20" />
							<p class=" px-1">Deployed forms</p>
						</Button>
						<Button
							class=" flex items-center justify-start bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
						>
							<Icon class="" icon="ph:folder-fill" width="20" height="20" />
							<p class="px-2">Folder's</p></Button
						>
					</div>
					<Button
						class="mb-3 flex items-center justify-start bg-transparent text-black duration-300 hover:bg-slate-200 dark:text-white dark:hover:bg-slate-500"
					>
						<Icon class=" " icon="ci:trash-full" width="20" height="20" />
						<p class="px-2">Trash</p>
					</Button>
				</div>
			{/if}
		</div>
	</div>
	<div class="h-full w-full">
		<div class="container mx-auto py-10">
			<div class="mb-4 flex flex-row">
				<p>My forms..</p>
				<Button class="ml-auto" on:click={openAssessment}>Add New</Button>
			</div>

			{#if openAssessmentForm}
				<div class="fixed inset-0 z-40 bg-gray-800 bg-opacity-50 backdrop-blur-md">
					<AssessmentForm data={data.assessmentSchema} on:close={closeForms} />
				</div>
			{/if}

			<DataTable {assessments} />
		</div>
	</div>
</div>

<style>
	@keyframes slide {
		0% {
			left: -100%;
		}
		100% {
			left: 100%;
		}
	}
</style>
