import type { Actions } from './$types';

// Define form actions
export const actions: Actions = {
    submit: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const role = formData.get('role');

        // Validate form data
        if (!name || !role) {
            return { success: false, message: 'Name and Role are required' };
        }

        // Simulate saving to a database or other processing
        console.log('Received Data from action server:', { name, role });

        return { success: true, message: 'Form submitted successfully!' };
    },
};
