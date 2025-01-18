<script>
	const images = [
		{
			src: 'https://www.bing.com/images/search?view=detailV2&ccid=tLotgCDt&id=983EA16A8AF79F73D42E4C906F8828AFBC811FA5&thid=OIP.tLotgCDtzgTdwJcTiXWRCwHaEK&mediaurl=https%3a%2f%2fcubanvr.com%2fwp-content%2fuploads%2f2023%2f07%2fai-image-generators.webp&exph=1080&expw=1920&q=image&simid=607995021641073382&FORM=IRPRST&ck=0D84343191C55C0EB02925BA8C8AC7B9&selectedIndex=0&itb=0&idpp=overlayview&ajaxhist=0&ajaxserp=0',

			alt: 'Progressive Image 1'
		},
		{
			src: 'https://www.bing.com/images/search?view=detailV2&ccid=GPgOs%2Fsd&id=237F6E72F64F237A96A5576DA48185527F095164&thid=OIP.GPgOs_sd9nF8fsKDOJe9dQHaEo&mediaurl=https%3A%2F%2Fwww.allo-image.net%2Fstockimg%2Fupload%2F3467768495a4f599cced094k_wallpaper_5.jpg&exph=1050&expw=1680&q=image&simid=608043301369045398&FORM=IRPRST&ck=9D4247ED7DE910E120CC73DFDBFA5692&selectedIndex=8&itb=0&cw=1375&ch=664&ajaxhist=0&ajaxserp=0',

			alt: 'Progressive Image 2'
		},
		{
			src: 'https://www.bing.com/images/search?view=detailV2&ccid=0ZM7e1Z%2F&id=5A7F135FDF2831FD51A33192913543978D1A9A1F&thid=OIP.0ZM7e1Z_zmebcBILunvbHQHaEn&mediaurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2015%2F04%2F23%2F22%2F00%2Ftree-736885_1280.jpg&exph=797&expw=1280&q=image&simid=608010260159481157&FORM=IRPRST&ck=CD61655E677E77AE5527E4CF72031DB7&selectedIndex=15&itb=0&cw=1375&ch=664&ajaxhist=0&ajaxserp=0',

			alt: 'Progressive Image 3'
		}
	];
</script>

<div class="min-h-screen">
	<h1 class="my-4 text-center text-2xl font-bold">Progressive Loading Demo</h1>
	<p class="mb-4 text-center">Images start blurry and load progressively.</p>
	<div class="flex flex-col items-center space-y-6">
		{#each images as { src, alt }}
			<picture>
				<source srcset={src} type="image/jpeg" />
				<img src={src} {alt} class="h-44 w-fit max-w-xl rounded-lg shadow-lg" />
			</picture>
		{/each}
	</div>
</div>
