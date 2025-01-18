# Documentation: Form Data Management in SvelteKit with Reset and Update Functionality
This document describes the implementation of a user form that fetches data from a backend, displays it in form fields for editing, and provides a reset functionality to restore the original data.

The implementation includes:

1. A +page.server.ts file to fetch data from the backend.
2. A +page.svelte file to display and manage the form with reactive updates.

## File 1: ```+page.server.ts```

# Purpose

This file fetches user data from a backend and provides it to the SvelteKit page. The data is returned in a format consumable by the Svelte component.

```svelte
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const user = {
    id: 1,
    CountryCode: '91',
    Email: 'john.doe@example.com',
    FirstName: 'John',
    LastName: 'Doe',
    Password: 'password123',
    Phone: '9876543210',
    Username: 'johnny'
  };

  return { user };
};

```
Explanation
The load function runs on the server and fetches the user data (simulated here as static data).
The returned user object includes fields like FirstName, LastName, Phone, etc.
The data is available on the page via data in +page.svelte.
Advantages
Centralized data fetching ensures the client always receives consistent data.
Runs securely on the server side.
Avoids exposing sensitive API calls to the client.
Disadvantages
This example uses static data. For real-world cases, ensure error handling and proper backend API integration.
May require caching strategies for performance optimization.

File 2: +page.svelte
Purpose
This file:

Displays the fetched user data in a form.
Updates the formData reactively as fields are edited.
Provides a Reset button to restore form fields to the original data.
Allows submission of updated data.


```
<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import type { PageServerData } from './$types';

  export let data: PageServerData;

  // Reactive form data
  let formData = { ...data.user };
  let originalData = { ...data.user };

  // Reset form to original values
  const handleReset = () => {
    formData = { ...originalData };
  };

  // Update form field
  const handleInputChange = (key: keyof typeof formData, event: Event) => {
    const target = event.target as HTMLInputElement;
    formData[key] = target.value;
  };

  // Submit updated form data
  const handleSubmit = () => {
    console.log('Updated Form Data:', formData);
  };

  // Re-initialize form data when navigation happens
  onMount(() => {
    formData = { ...data.user };
    originalData = { ...data.user };
  });

  afterNavigate(() => {
    formData = { ...data.user };
    originalData = { ...data.user };
  });
</script>

<div class="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
  <h2 class="text-2xl font-bold mb-4">Update User Information</h2>
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <!-- First Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700">First Name</label>
      <input
        type="text"
        bind:value={formData.FirstName}
        on:input={(e) => handleInputChange('FirstName', e)}
        class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Last Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700">Last Name</label>
      <input
        type="text"
        bind:value={formData.LastName}
        on:input={(e) => handleInputChange('LastName', e)}
        class="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <!-- Buttons -->
    <div class="flex justify-between">
      <button
        type="button"
        on:click={handleReset}
        class="w-full mr-2 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
      >
        Reset
      </button>
      <button
        type="submit"
        class="w-full ml-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  </form>
</div>

```