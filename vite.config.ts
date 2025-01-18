import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});


// import { defineConfig } from 'vite';
// import { sveltekit } from '@sveltejs/kit/vite';

// export default defineConfig({
//     plugins: [sveltekit()],
//     build: {
//         rollupOptions: {
//             input: {
//                 // main: 'src/main.ts', // Remove or comment this out if unnecessary
//                 serviceWorker: 'src/service-worker.js' // Ensure this points to the correct file
//             }
//         }
//     }
// });

