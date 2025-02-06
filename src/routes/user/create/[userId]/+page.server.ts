// +page.server.ts
import { formDataArray, schema } from '$lib/index';
import { error, type RequestEvent } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event: RequestEvent) => {
    const userId = event.params.userId;
    const user = formDataArray.find(user => user.id === userId);

    if (!user) {
        return {
            status: 404,
            error: new Error('User not found')
        };
    }

    if (!user) error(404, 'Not found');

    const form = await superValidate(user, zod(schema), { errors: true });

    return { form };
};


export const actions = {
    create: async ({ request }) => {
        console.log('Form submitted');
        // The adapter must be defined before superValidate for JSON Schema.
        const adapter = zod(schema);
        const form = await superValidate(request, adapter);

        console.log(form);

        if (!form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { form });
        }


        // const user = formDataArray.find(user => user.id === 1);

        // if (user.FirstName === form.data.FirstName) {
        //     return setError(form, 'FirstName', 'FirstName already exists.');
        // }
        // if (user.LastName === form.data.LastName) {
        //     return setError(form, 'LastName', 'LastName already exists.');
        // }
        // if (user.CountryCode === form.data.CountryCode) {
        //     return setError(form, 'CountryCode', 'CountryCode already exists.');
        // }
        // if (user.Phone === form.data.Phone) {
        //     return setError(form, 'Phone', 'Phone already exists.');
        // }
        // if (user.Email === form.data.Email) {
        //     return setError(form, 'Email', 'E-mail already exists.');
        // }
        // if (user.Username === form.data.Username) {
        //     return setError(form, 'Username', 'Username already exists.');
        // }
        // if (user.Password === form.data.Password) {
        //     return setError(form, 'Password', 'Password already exists.');
        // }

        return { form };
    }
};