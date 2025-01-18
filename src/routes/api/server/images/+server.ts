import { json } from '@sveltejs/kit';

export async function GET() {
    const images = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        url: `https://picsum.photos/600/400?random=${i + 1}`,  // Gets a images from lorem picsum website for demo
    }));
    return json(images);
}
