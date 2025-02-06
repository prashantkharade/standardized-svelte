import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json(); // Parse incoming data
        console.log('Received data from API server:', data);

        // Simulate saving data to a database or performing other operations
        // Example:
        // await database.save(data);

        return new Response(
            JSON.stringify({ message: 'Data successfully submitted' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in /submit/submitForm:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process data' }),
            { status: 500 }
        );
    }
};
