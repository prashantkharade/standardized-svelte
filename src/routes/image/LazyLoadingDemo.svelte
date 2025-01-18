<script>
	const images = [
		{
			src: 'https://www.bing.com/images/search?view=detailV2&ccid=gcUJbmVC&id=EA7298706A5EE98542D6766F0544B778C8CA9FB5&thid=OIP.gcUJbmVC2h7syxmlqiuV-wHaFa&mediaurl=https%3a%2f%2fst.quantrimang.com%2fphotos%2fimage%2f2019%2f06%2f27%2fdemo-la-gi-2.jpg&exph=468&expw=640&q=demo+images&simid=608024704155781212&FORM=IRPRST&ck=F733961FC2D9BAB7583B5F3E807416F2&selectedIndex=0&itb=0&idpp=overlayview&ajaxhist=0&ajaxserp=0',
			alt: 'Lazy Image 1'
		},
		{
			src: 'https://www.bing.com/images/search?view=detailV2&ccid=GPgOs%2Fsd&id=237F6E72F64F237A96A5576DA48185527F095164&thid=OIP.GPgOs_sd9nF8fsKDOJe9dQHaEo&mediaurl=https%3A%2F%2Fwww.allo-image.net%2Fstockimg%2Fupload%2F3467768495a4f599cced094k_wallpaper_5.jpg&exph=1050&expw=1680&q=image&simid=608043301369045398&FORM=IRPRST&ck=9D4247ED7DE910E120CC73DFDBFA5692&selectedIndex=8&itb=0&cw=1375&ch=664&ajaxhist=0&ajaxserp=0',
			alt: 'Lazy Image 2'
		},
		{
			src: 'https://www.bing.com/images/search?view=detailV2&ccid=0ZM7e1Z%2F&id=5A7F135FDF2831FD51A33192913543978D1A9A1F&thid=OIP.0ZM7e1Z_zmebcBILunvbHQHaEn&mediaurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2015%2F04%2F23%2F22%2F00%2Ftree-736885_1280.jpg&exph=797&expw=1280&q=image&simid=608010260159481157&FORM=IRPRST&ck=CD61655E677E77AE5527E4CF72031DB7&selectedIndex=15&itb=0&cw=1375&ch=664&ajaxhist=0&ajaxserp=0',
			alt: 'Lazy Image 3'
		}
	];
</script>

<div class="min-h-screen">
	<h1 class="my-4 text-center text-2xl font-bold">Lazy Loading Demo</h1>
	<p class="mb-4 text-center">Scroll down to load the images!</p>
	<div class="flex flex-col items-center space-y-6">
		{#each images as img}
			<img
				src={img.src}
				alt={img.alt}
				loading="lazy"
				class="h-44 w-fit max-w-xl rounded-lg shadow-lg"
			/>
		{/each}
	</div>
</div>

<img
	src="https://www.bing.com/images/search?view=detailV2&ccid=0ZM7e1Z%2F&id=5A7F135FDF2831FD51A33192913543978D1A9A1F&thid=OIP.0ZM7e1Z_zmebcBILunvbHQHaEn&mediaurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2015%2F04%2F23%2F22%2F00%2Ftree-736885_1280.jpg&exph=797&expw=1280&q=image&simid=608010260159481157&FORM=IRPRST&ck=CD61655E677E77AE5527E4CF72031DB7&selectedIndex=15&itb=0&cw=1375&ch=664&ajaxhist=0&ajaxserp=0"
	alt="image"
/>

<h1>Lazy Loading Images</h1>

<!-- loading attribute of image tag is 
	used to specify lazy loading -->
<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171634/1.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171633/2.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171632/3.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171631/4.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171629/5.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171628/6.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171627/7.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171626/8.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171625/9.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171623/10.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171622/11.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171621/12.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171620/13.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171619/14.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>

<img
	src="https://media.geeksforgeeks.org/wp-content/uploads/20201109171618/15.jpg"
	alt="numbers"
	loading="lazy"
	width="300"
	height="300"
	style="display:block; margin:10px"
/>
