import type { Actions } from './$types';


// +page.server.ts
import { workerSchema } from '$lib/index';

import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {

    const form = await superValidate(zod(workerSchema), { errors: true });

    return { form };
};

export const actions: Actions = {
    another: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const age = formData.get('age');

        console.log('Form submitted');
        // The adapter must be defined before superValidate for JSON Schema.
        const adapter = zod(workerSchema);
        const form = await superValidate(request, adapter);

        console.log(form);

        if (!form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { form });
        }
        try {
            await fetch('/api/server/submit/submitForm', {
                method: 'POST',
                body: JSON.stringify({ email, age }),
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Error saving data:', error);
            return { success: false, error: 'Failed to save data.' };
        }

        return { form };
    }
};
