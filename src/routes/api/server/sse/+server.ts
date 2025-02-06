// import type { RequestHandler } from './$types';

// export const GET: RequestHandler = async ({ request }) => {
//     const stream = new ReadableStream({
//         start(controller) {
//             console.log("Request ")
//             let counter = 0;


//             const interval = setInterval(() => {
//                 const data = JSON.stringify({ message: `Update #${++counter}`, timestamp: new Date().toISOString() });
//                 controller.enqueue(`data: ${data}\n\n`);

//                 if (counter >= 10) {
//                     clearInterval(interval);
//                     controller.close();
//                 }
//             }, 1000);


//             request.signal.addEventListener('abort', () => {
//                 clearInterval(interval);
//                 controller.close();
//             });
//         },
//     });

//     return new Response(stream, {
//         headers: {
//             'Content-Type': 'text/event-stream',
//             'Cache-Control': 'no-cache',
//             'Connection': 'keep-alive',
//         },
//     });
// };

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
    let lastData: string | null = null;
    let isClosed = false; // Track if the stream is closed

    const stream = new ReadableStream({
        start(controller) {
            const interval = setInterval(async () => {
                if (isClosed) return; // Stop if the stream is closed

                try {
                    const response = await fetch('http://localhost:5555/api/v1/users/80680af6-f9ea-443f-9295-c90db860249d');

                    if (!response.ok) {
                        throw new Error(`API returned status ${response.status}: ${response.statusText}`);
                    }

                    const text = await response.text();
                    console.log('Raw API response:', text); // Log raw response

                    let data;
                    try {
                        data = JSON.parse(text); // Attempt to parse JSON
                    } catch (err) {
                        throw new Error('Failed to parse JSON response from API');
                    }

                    // Check if data has changed
                    const currentData = JSON.stringify(data);
                    if (currentData !== lastData) {
                        lastData = currentData;
                        controller.enqueue(`data: ${currentData}\n\n`);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    if (!isClosed) {
                        controller.enqueue(
                            `event: error\ndata: ${JSON.stringify({ error: error })}\n\n`
                        );
                    }
                }
            }, 5000); // Poll every 5 seconds

            // Handle abort signal (client disconnects)
            request.signal.addEventListener('abort', () => {
                clearInterval(interval); // Stop the interval
                controller.close(); // Close the stream
                isClosed = true; // Mark as closed
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
};
