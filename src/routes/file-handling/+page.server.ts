// // NOTE: Import fail from Superforms, not from @sveltejs/kit!
// import { schema } from '$lib';
// import { superValidate, fail, message, } from 'sveltekit-superforms';
// import { zod } from 'sveltekit-superforms/adapters';

// export const load = async () => {
//     return {
//         form: await superValidate(zod(schema))
//     }
// };


// export const actions = {
//     default: async ({ request }) => {
//         const formData = await request.formData();
//         const form = await superValidate(formData, zod(schema));

//         if (!form.valid) return fail(400, { form });

//         const image = formData.get('image');
//         if (image instanceof File) {
//             console.log("this is image",image);
//         }

//         return message(form, 'Thank you for uploading an image!');
//     }
// };