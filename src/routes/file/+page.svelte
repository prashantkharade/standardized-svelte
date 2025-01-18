<script lang="ts">
	import { onMount } from 'svelte';
	let imageUrl: string | ArrayBuffer | null = null;
	let croppedImage: string | null = null;
	let imageElement: HTMLImageElement;
	let canvasElement: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let cropping = false;
	let isDrawing = false;
	let startX = 0;
	let startY = 0;
	let endX = 0;
	let endY = 0;

	const handleFileChange = (event: Event) => {
		const file = (event.target as HTMLInputElement).files[0];
		const reader = new FileReader();
		reader.onload = () => {
			imageUrl = reader.result;
		};
		reader.readAsDataURL(file);
	};

	const startCropping = () => {
		cropping = true;
		ctx = canvasElement.getContext('2d');
		ctx.drawImage(imageElement, 0, 0, canvasElement.width, canvasElement.height);
	};

	const startDrawing = (event: MouseEvent) => {
		isDrawing = true;
		startX = event.offsetX;
		startY = event.offsetY;
	};

	const drawRectangle = (event: MouseEvent) => {
		if (!isDrawing) return;
		endX = event.offsetX;
		endY = event.offsetY;
		ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		ctx.drawImage(imageElement, 0, 0, canvasElement.width, canvasElement.height);
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 2;
		ctx.strokeRect(startX, startY, endX - startX, endY - startY);
	};

	const finishDrawing = () => {
		isDrawing = false;
	};

	const cropImage = () => {
		const width = endX - startX;
		const height = endY - startY;
		const cropped = ctx.getImageData(startX, startY, width, height);
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = width;
		tempCanvas.height = height;
		const tempCtx = tempCanvas.getContext('2d');
		tempCtx.putImageData(cropped, 0, 0);
		croppedImage = tempCanvas.toDataURL('image/png');
	};

	const uploadImage = async () => {
		if (croppedImage) {
			const blob = await (await fetch(croppedImage)).blob();
			const formData = new FormData();
			formData.append('file', blob, 'cropped-image.png');

			const response = await fetch('/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				console.log('Image uploaded successfully!');
			} else {
				console.error('Failed to upload image.');
			}
		}
	};
</script>

<main>
	<input type="file" accept="image/*" on:change={handleFileChange} />
	{#if imageUrl}
		<img bind:this={imageElement} src={imageUrl} on:load={startCropping} style="max-width: 100%;" />
		<canvas
			bind:this={canvasElement}
			width="500"
			height="500"
			style="border: 1px solid black;"
			on:mousedown={startDrawing}
			on:mousemove={drawRectangle}
			on:mouseup={finishDrawing}
			on:mouseout={finishDrawing}
		></canvas>

		{#if croppedImage}
			<img src={croppedImage} alt="Cropped Image" style="max-width: 100%;" />
			<button on:click={uploadImage}>Upload Cropped Image</button>
		{/if}

		<button on:click={cropImage}>Crop Image</button>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	input,
	label {
		margin-bottom: 1rem;
	}
	button {
		margin-top: 1rem;
	}
	canvas {
		cursor: crosshair;
	}
</style>
