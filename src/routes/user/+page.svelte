<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { enhance } from '$app/forms';

	import Icon from '@iconify/svelte';

	import Autoplay from 'embla-carousel-autoplay';
	import * as Carousel from '$lib/components/ui/carousel/index.js';

	const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<div class="container mx-auto p-8">
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="rounded p-8 shadow">
			<div class="mb-6 flex justify-center">
				<div class="flex h-32 w-32 items-center justify-center">
					<Carousel.Root
						plugins={[plugin]}
						class="w-full max-w-xs"
						on:mousenter={plugin.stop}
						on:mouseleave={plugin.reset}
					>
						<Carousel.Content>
							{#each Array(5) as _, i (i)}
								<Carousel.Item>
									<div class="">
										<Card.Root>
											<Card.Content class="flex aspect-square items-center justify-center p-6">
												<span class="text-4xl font-semibold">{i + 1}</span>
											</Card.Content>
										</Card.Root>
									</div>
								</Carousel.Item>
							{/each}
						</Carousel.Content>
						<Carousel.Previous />
						<Carousel.Next />
					</Carousel.Root>
				</div>
			</div>
			<h2 class="mb-4 text-center text-lg">Manage for all accounts</h2>
			<p class="mb-4 text-pretty">
				Move away from risky passwords and experience one-tap access to Zoho. Download and install
				OneAuth. Secure online accounts with OneAuth 2FA. Back up OTP secrets and never lose access
				to your accounts.
			</p>
			<Button class="mb-4 w-full rounded  p-3 ">Learn more</Button>
		</div>
		<!-- Left Side -->
		<div class="rounded p-8 shadow">
			<div class="mb-6">
				<div class="mx-auto h-12 w-12 rounded-full bg-blue-500"></div>
				<h1 class=" text-center text-xl font-bold">zForms</h1>
			</div>
			<!-- <h2 class="mb-4 text-base">Sign in to access   <span class="text-lg">zForms</span></h2> -->
			<div class="mx-auto flex items-center justify-center">
				<Card.Root class="w-[350px] rounded-xl">
					<Card.Header>
						<Card.Title>Sign in</Card.Title>
					</Card.Header>
					<Card.Content>
						<form method="post" action="?/login" class="rounded-lg" use:enhance>
							<div class="grid w-full items-center gap-4">
								<div class="flex w-full max-w-sm flex-col gap-1.5">
									<Label for="email">Email / Username</Label>
									<Input
										type="text"
										placeholder="username"
										class="max-w-xs"
										name="username"
										required
									/>
								</div>
								<div class="flex w-full max-w-sm flex-col gap-1.5">
									<Label for="email">Password</Label>
									<Input
										type="password"
										name="password"
										placeholder="password"
										class="max-w-xs"
										required
									/>
								</div>

								<div class="flex flex-col space-y-1.5"></div>
							</div>
							<Button class="w-full bg-slate-700 p-2 text-white" type="submit">Login</Button>
						</form>
					</Card.Content>
					<Card.Footer>
					</Card.Footer>
				</Card.Root>
			</div>
			<div class="mt-4 text-center">
				<p>Sign in using</p>
				<div class="mt-2 flex justify-center space-x-4">
					<!-- <Button class="rounded p-2 "> -->
					<Icon icon="logos:google-icon" width="36" height="36" />
					<!-- </Button> -->
					<!-- <Button class=" rounded p-2 "> -->
					<Icon icon="logos:facebook" width="36" height="36" />
					<!-- </Button> -->
					<!-- <Button class=" rounded p-2"> -->
					<Icon icon="devicon:linkedin" width="36" height="36" />
					<!-- </Button> -->
					<!-- <Button class=" rounded p-2"> -->
					<Icon icon="logos:microsoft-icon" width="36" height="36" />
					<!-- </Button> -->
					<!-- <Button class=" rounded p-2"> -->
					<Icon
						icon="ant-design:github-outlined"
						width="36"
						height="36"
						style="color: black dark:cornsilk"
					/>
					<!-- </Button> -->
				</div>
				<p class="mt-4">
					Don't have an account? <a href="#" class="text-blue-500">Sign up now</a>
				</p>
			</div>
		</div>

		<!-- Right Side -->
	</div>
</div>
