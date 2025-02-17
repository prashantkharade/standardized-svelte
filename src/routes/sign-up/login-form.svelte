<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { loginSchema, type LoginSchema } from './login-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	// import { Button } from '$lib/components/ui/button/index.js';
	// import { Checkbox } from '$lib/components/ui/checkbox';

	export let data: SuperValidated<Infer<LoginSchema>>;

	const form = superForm(data, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<div class="mb-4 grid grid-cols-1 gap-6 md:grid-cols-2  ">
		<div class="rounded-md border p-4 shadow-md">
			<h3 class="mb-2 text-center text-lg font-semibold">Personal Information</h3>
			<!-- <div class="mb-2"> -->
				<Form.Field {form} name="firstname">
					<Form.Control let:attrs>
						<Form.Label>First Name</Form.Label>
						<Input {...attrs} bind:value={$formData.firstname} />
					</Form.Control>
					<!-- <Form.Description>This is your public display name.</Form.Description> -->
					<Form.FieldErrors />
				</Form.Field>
			<!-- </div> -->
			<!-- <div class="mb-2"> -->
				<Form.Field {form} name="lastname">
					<Form.Control let:attrs>
						<Form.Label>Last Name</Form.Label>
						<Input {...attrs} bind:value={$formData.lastname} />
					</Form.Control>
					<!-- <Form.Description>This is your public display name.</Form.Description> -->
					<Form.FieldErrors />
				</Form.Field>
			<!-- </div> -->
			<!-- <div class="mb-2"> -->
				<Form.Field {form} name="email">
					<Form.Control let:attrs>
						<Form.Label>Email</Form.Label>
						<Input {...attrs} bind:value={$formData.email} />
					</Form.Control>
					<!-- <Form.Description>This is your public display name.</Form.Description> -->
					<Form.FieldErrors />
				</Form.Field>
			<!-- </div> -->
			<!-- <div class="mb-2"> -->
				<Form.Field {form} name="phone">
					<Form.Control let:attrs>
						<Form.Label>Phone</Form.Label>
						<Input {...attrs} bind:value={$formData.phone} />
					</Form.Control>
					<!-- <Form.Description>This is your public display name.</Form.Description> -->
					<Form.FieldErrors />
				</Form.Field>
			<!-- </div> -->
		</div>
		<div class="rounded-md border p-4 shadow-md">
			<h3 class="mb-2 text-center text-lg font-semibold">Sign Up Information</h3>
			<div class="mb-2">
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Form.Label>Username</Form.Label>
						<Input {...attrs} bind:value={$formData.username} />
					</Form.Control>
					<!-- <Form.Description>This is your public display name.</Form.Description> -->
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="mb-2">
				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Password</Form.Label>
						<Input {...attrs} bind:value={$formData.password} />
					</Form.Control>
					<!-- <Form.Description>This is your public display name.</Form.Description> -->
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<div class="mb-2">
				<Form.Field {form} name="confirmPassword">
					<Form.Control let:attrs>
						<Form.Label>Confirm Password</Form.Label>
						<Input {...attrs} bind:value={$formData.confirmPassword} />
					</Form.Control>
					<!-- <Form.Description>This is your public display name.</Form.Description> -->
					<Form.FieldErrors />
				</Form.Field>
			</div>
		</div>
	</div>
</form>
