<script lang="ts">
	import type { PageServerData } from '../$types';
	import LoginForm from './login-form.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { loginSchema } from './login-schema';
	export let data: PageServerData;
</script>

<!-- <div class="flex min-h-screen flex-col items-center p-4">
	<div class="w-full max-w-3xl rounded-lg border p-8 shadow-lg dark:shadow-lg dark:shadow-white">
		<div class="mb-6 flex items-center">
			<div class="h-12 w-12 rounded-full bg-blue-500"></div>
			<h1 class="ml-4 text-2xl font-bold">zForms</h1>
		</div>
		<h2 class="mb-4 text-xl font-semibold">Create an account for utilizing our features</h2>
		<form>
			<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="firstname" class="block text-sm font-medium text-gray-700">Firstname</label>
					<input
						type="text"
						id="firstname"
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
					/>
				</div>
				<div>
					<label for="lastname" class="block text-sm font-medium text-gray-700">Lastname</label>
					<input
						type="text"
						id="lastname"
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
					/>
				</div>
			</div>
			<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
					<input
						type="email"
						id="email"
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
					/>
				</div>
				<div>
					<label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
					<input
						type="text"
						id="phone"
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
					/>
				</div>
			</div>
			<div class="mb-4">
				<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
				<input
					type="text"
					id="username"
					class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
				/>
			</div>
			<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
					<input
						type="password"
						id="password"
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
					/>
				</div>
				<div>
					<label for="confirmPassword" class="block text-sm font-medium text-gray-700"
						>Confirm Password</label
					>
					<input
						type="password"
						id="confirmPassword"
						class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
					/>
				</div>
			</div>
			<div class="mb-4 flex items-center">
				<input
					type="checkbox"
					id="agree"
					class="h-4 w-4 rounded border-gray-300 text-blue-600"
				/>
				<label for="agree" class="ml-2 block text-sm text-gray-900"
					>I agree to the Terms of Service and Privacy Policy</label
				>
			</div>
			<button type="submit" class="w-full rounded-md bg-blue-500 p-2 text-white">Sign up</button>
		</form>
		<div class="mt-4 text-center">
			<p>or sign in using</p>
			<div class="mt-2 flex justify-center space-x-2">
				<div class="h-10 w-10 rounded bg-blue-500"></div>
				<div class="h-10 w-10 rounded bg-blue-500"></div>
				<div class="h-10 w-10 rounded bg-blue-500"></div>
				<div class="h-10 w-10 rounded bg-blue-500"></div>
				<div class="h-10 w-10 rounded bg-blue-500"></div>
			</div>
		</div>
	</div>
</div> -->
<div class="flex min-h-screen flex-col items-center p-4">
	<div class="w-full max-w-5xl rounded-lg p-8 shadow-lg dark:shadow-lg dark:shadow-white">
		<div class="mb-4 flex items-center">
			<div class="h-12 w-12 rounded-full bg-blue-500"></div>
			<h1 class="ml-4 text-2xl font-bold">zForms</h1>
		</div>
		<h2 class="mb-2 text-xl font-semibold">Create an account for utilizing our features</h2>
		<LoginForm data={data.form} />

		<!-- Acknowledge -->
		<div class="mb-2 flex items-center">
			<div class="items-top flex space-x-2">
				<Checkbox id="terms1" />
				<div class="grid gap-1.5 leading-none">
					<Label
						for="terms1"
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						Accept terms and conditions
					</Label>
					<p class="text-sm text-muted-foreground">
						You agree to our Terms of Service and Privacy Policy.
					</p>
				</div>
			</div>
		</div>
		<Button type="submit" class="w-full">Sign up</Button>

		<!-- SSO info -->
		<!-- <div class="mt-4 text-center">
			<p>or sign in using</p>
			<div class="mt-2 flex justify-center space-x-2">
				<div class="mt-2 flex justify-center space-x-4">
					<Icon icon="logos:google-icon" width="36" height="36" />
					<Icon icon="logos:facebook" width="36" height="36" />
					<Icon icon="devicon:linkedin" width="36" height="36" />
					<Icon icon="logos:microsoft-icon" width="36" height="36" />
					<Icon
						icon="ant-design:github-outlined"
						width="36"
						height="36"
						style="color: black dark:cornsilk"
					/>
				</div>
			</div>
		</div> -->
	</div>
</div>
