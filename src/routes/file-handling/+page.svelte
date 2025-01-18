<!-- <script lang="ts">

	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';

	let imageFile: string | null = null; // To hold the selected image URL
	let cropper: Cropper | null = null; // Cropper instance
	let previewUrl: string = ''; // To display the cropped image preview
	let cropperRef: HTMLImageElement | null = null; // Ref for the image element

	// Handle file input change
	const handleFileChange = (event: Event): void => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			imageFile = URL.createObjectURL(file);
			previewUrl = ''; // Reset the preview URL
		}
	};

	// Initialize cropper
	const initializeCropper = (): void => {
		if (cropper) cropper.destroy(); // Destroy previous instance
		if (cropperRef) {
			cropper = new Cropper(cropperRef, {
				aspectRatio: 1, // Square crop
				viewMode: 1 // Restrict crop area to image bounds
			});
		}
	};

	// Handle crop and upload
	const handleCrop = async (): Promise<void> => {
		if (cropper) {
			const canvas = cropper.getCroppedCanvas({
				width: 300,
				height: 300
			});

			previewUrl = canvas.toDataURL('image/jpeg');

			// Convert to Blob for upload
			const croppedBlob = await new Promise<Blob | null>((resolve) =>
				canvas.toBlob(resolve, 'image/jpeg')
			);

			if (croppedBlob) {
				await uploadImage(croppedBlob);
			}
		}
	};

	// Upload image to backend
	const uploadImage = async (blob: Blob): Promise<void> => {
		const formData = new FormData();
		formData.append('file', blob, 'profile.jpg');

		try {
			const response = await fetch('/api/server/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				alert('Image uploaded successfully!');
			} else {
				alert('Image upload failed.');
			}
		} catch (error) {
			console.error('Error uploading image:', error);
			alert('An error occurred while uploading the image.');
		}
	};
</script>

<div class="space-y-4">

	<input type="file" accept="image/*" on:change={handleFileChange} class="block w-full" />


	{#if imageFile}
		<div class="relative">
			<img
				bind:this={cropperRef}
				src={imageFile}
				on:load={initializeCropper}
				class="max-w-full rounded-md"
			/>
		</div>
	{/if}

	
	{#if cropper}
		<div class="flex space-x-4">
			<button class="btn btn-primary" on:click={handleCrop}>Crop & Upload</button>
		</div>
	{/if}


	{#if previewUrl}
		<div>
			<h3>Cropped Preview:</h3>
			<img src={previewUrl} alt="Cropped Image" class="h-24 w-24 rounded-full" />
		</div>
	{/if}
</div>

<style>
	img {
		max-width: 100%;
		height: auto;
	}

	.btn {
		@apply rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700;
	}
</style> -->

<script lang="ts">
	let previewImage: string | null = null;
	let croppedImage: string | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let showModal = false;

	// Cropping states
	let startX = 0,
		startY = 0,
		endX = 0,
		endY = 0;
	let cropping = false;
	let hasBoundingBox = false;

	function onFileSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			previewImage = reader.result as string;
			showModal = true;
			hasBoundingBox = false; // Reset bounding box on new image
		};
		reader.readAsDataURL(file);
	}

	function startCrop(event: MouseEvent) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		startX = event.clientX - rect.left;
		startY = event.clientY - rect.top;
		cropping = true;
	}

	function crop(event: MouseEvent) {
		if (!cropping || !canvas) return;
		const rect = canvas.getBoundingClientRect();
		endX = event.clientX - rect.left;
		endY = event.clientY - rect.top;

		const ctx = canvas.getContext('2d');
		if (ctx && previewImage) {
			// Draw the image and the cropping rectangle
			const img = new Image();
			img.src = previewImage;
			img.onload = () => {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				ctx.strokeStyle = 'red';
				ctx.lineWidth = 2;
				ctx.strokeRect(startX, startY, endX - startX, endY - startY);
			};
		}
	}

	function endCrop() {
		cropping = false;
		hasBoundingBox = true; // Set flag to true after bounding box creation
	}

	function confirmCrop() {
		if (!canvas || !previewImage || !hasBoundingBox) return;

		const ctx = canvas.getContext('2d');
		if (ctx) {
			const img = new Image();
			img.src = previewImage;
			img.onload = () => {
				const cropCanvas = document.createElement('canvas');
				const cropCtx = cropCanvas.getContext('2d');
				if (cropCtx) {
					const cropWidth = Math.abs(endX - startX);
					const cropHeight = Math.abs(endY - startY);
					cropCanvas.width = cropWidth;
					cropCanvas.height = cropHeight;

					const sx = Math.min(startX, endX);
					const sy = Math.min(startY, endY);

					cropCtx.drawImage(img, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
					croppedImage = cropCanvas.toDataURL('image/png');
					showModal = false;
				}
			};
		}
	}
</script>

<div class="flex flex-col items-center">
	<!-- Upload Section -->
	<label class="cursor-pointer">
		<div
			class="text-info my-4 flex h-36 w-36 items-center justify-center rounded-full bg-blue-400 text-3xl"
		>
			{#if croppedImage}
				<img src={croppedImage} alt="Cropped Image" class="h-36 w-36 rounded-full" />
			{:else}
				Upload
			{/if}
		</div>
		<input id="fileinput" type="file" class="hidden" accept="image/*" on:change={onFileSelected} />
	</label>

	<!-- Crop Modal -->
	{#if showModal}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="w-1/2 max-w-screen-lg rounded-lg bg-white p-6 shadow-lg">
				<h2 class="mb-4 text-lg font-semibold">Crop Image</h2>
				{#if previewImage}
					<canvas
						bind:this={canvas}
						class="rounded-md border"
						width="500"
						height="500"
						on:mousedown={startCrop}
						on:mousemove={crop}
						on:mouseup={endCrop}
					></canvas>
				{:else}
					<p>Image loading...</p>
				{/if}
				<div class="mt-4 flex justify-end space-x-4">
					<button
						class=" w-full rounded-md bg-red-300 py-2 text-base font-bold shadow transition duration-200 hover:bg-red-600"
						on:click={() => (showModal = false)}>Cancel</button
					>
					<button
						class=" w-full rounded-md bg-blue-300 py-2 text-base font-bold shadow transition duration-200 hover:bg-blue-600"
						on:click={confirmCrop}>Confirm & Save</button
					>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	canvas {
		max-width: 100%;
		height: auto;
	}
</style>
