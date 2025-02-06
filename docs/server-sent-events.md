# Server sent Events

[MDN link](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

[detail explaination](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events)

[github repo for reference](https://sveltethemes.dev/sanrafa/sveltekit-sse-example)

[medium link](https://medium.com/version-1/sse-in-sveltekit-5c085b3b61d1)

[live playground](https://sse.dev/)

## Core Concepts of Server-Sent Events

Server-Sent Events allow a server to push updates to the client over a single, long-lived HTTP connection. Unlike WebSockets, which offer full-duplex communication, SSE is a unidirectional channel where the server sends data, and the client listens.

**Key Features:**

**Unidirectional Communication**: Ideal for scenarios where the client needs to receive real-time updates without sending data back.

**Persistent Connection**: A single HTTP connection remains open, reducing overhead.

**Automatic Reconnection**: The client automatically attempts to reconnect if the connection drops.

**Lightweight**: Simpler than WebSockets, making it easier to implement for straightforward use cases.

> **Analogy**: Think of SSE as subscribing to a newsletter—once you sign up (connect), you receive new issues (data) as they're published, without having to check back manually

## How Does SSE Work?

**Client Initiation**: The client creates an EventSource object, initiating a connection to the server's SSE endpoint.

**Server Response**: The server sets the appropriate headers and maintains the connection, sending data as events occur.

**Data Transmission**: The server sends messages in a specific format, and the client listens for incoming messages or specific event types.

**Connection Handling**: If the connection is interrupted, the client automatically tries to reconnect after a few seconds.

Workflow Diagram:

Client (Browser)                               Server
     |                                           |
     | ----------- Establish Connection -------->|
     |                                           |
     |<-------------- Send Events ---------------|
     |                                           |
     |         (Automatic Reconnection)          |
     |                                           |

## Scenario 1: For Continuous Request and update

Add this to your `+page.svelte` file

```js
<script lang="ts">
 import { onMount } from 'svelte';
 import { writable } from 'svelte/store';

 const events = writable<string[]>([]);

 onMount(() => {
    const eventSource = new EventSource('/api/server/sse');

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        events.update((current) => [...current, `${data.message} at ${data.timestamp}`]);
    };

    eventSource.onerror = () => {
        console.error('SSE connection error. Closing connection.');
        eventSource.close();
     };

    return () => {
        eventSource.close();
    };
});
</script>

<div class="p-4">
    <h1 class="mb-4 text-xl font-bold">Server-Sent Events</h1>
    <ul class="space-y-2">
        {#each $events as event}
            <li class="rounded bg-gray-100 p-2">{event}</li>
        {/each}
    </ul>
</div>
```

This will be API endpoint which give response on specific time interval

```js
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
    const stream = new ReadableStream({
        start(controller) {
            console.log("Request ")
            let counter = 0;


            const interval = setInterval(() => {
                const data = JSON.stringify({ message: `Update #${++counter}`, timestamp: new Date().toISOString() });
                controller.enqueue(`data: ${data}\n\n`);

                if (counter >= 10) {
                    clearInterval(interval);
                    controller.close();
                }
            }, 1000);


            request.signal.addEventListener('abort', () => {
                clearInterval(interval);
                controller.close();
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
```

## Scenario 2: For update data only change at serverside

Add this is `+page.svelte` file it update UI when there is any change in data you can show this data as you want

```js
<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    const updates = writable<string[]>([]); // Store the updates

    onMount(() => {
        const eventSource = new EventSource('/api/server/sse');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            updates.update((current) => [...current, `Title: ${data.title} | Body: ${data.body}`]); //Design here or arrange here how you want to show your data
        };

        eventSource.onerror = () => {
            console.error('SSE connection error. Closing connection.');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    });
</script>

<div class="p-4">
    <h1 class="mb-4 text-xl font-bold">Real-Time Data Updates</h1>
    <ul class="space-y-2">
        {#each $updates as update}
            <li class="rounded bg-gray-100 p-2">{update}</li>
        {/each}
    </ul>
</div>
```

And this will be your frontend API called from page and which get data in realtime

```js
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
    let lastData: string | null = null;
    let isClosed = false; // Track if the stream is closed

    const stream = new ReadableStream({
        start(controller) {
            const interval = setInterval(async () => {
                if (isClosed) return; // Stop if the stream is closed

                try {
                    const response = await fetch('YOUR_API_URL'); // Update your Url here for response

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
```

### Explanation

- **Initializing messages**: This reactive array holds all messages received from the server.

- **Creating EventSource**: Establishes a persistent connection to the server at the /sse endpoint.

- **Handling Incoming Messages**:
  - eventSource.onmessage is triggered whenever the server sends a new message.

  - We parse the incoming JSON data and update the messages array.

- **Error Handling**:

  - If an error occurs, we log it and close the connection to avoid any issues.

- **Cleanup with onDestroy**:

  - Ensures that the EventSource connection is closed when the component is destroyed, preventing memory leaks.

### Pros and Cons

- SSE are simple in concept and are less effort to implement in non JS based backends
- Only one way communication, so you’ll still need to use regular HTTP requests from the client if the browser needs to communicate back to the server
-bRestrictions in concurrent connections in modern browsers means only 6 connections can be open at one time across browser + domain (opening new tabs does not help this)
- SSE can only transmit text, not binary data

**Conclusion**
Server Sent Events are an alternative to WebSockets when you don’t require two way messaging and are simpler to implement in non JS backends. However, modern browsers support both SSE and WebSockets equally as well so it makes little sense to back yourself into a corner with SSE as you never know when your requirements might change. As for SvelteKit in particular, a less elegant way to work with WebSockets
