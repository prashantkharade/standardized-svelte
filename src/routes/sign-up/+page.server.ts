
import { superValidate } from "sveltekit-superforms";
import { fail, type Actions } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { loginSchema } from './login-schema';
import type { PageServerLoad } from "./$types";
// import chalk from "chalk";

///////////////////////////////////////////////////////////////////////////////////////

// export const load: PageServerLoad = async () => {

//     try {
//     return {
//         loginSchema: await superValidate(zod(loginSchema)),
//     };
//     } catch (error) {
//     console.error(`Error retriving assessment templates: ${error.message}`);
//     }
// };
export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(loginSchema)),
    };
};
export const actions: Actions
 = {
    default: async (event) => {
        const form = await superValidate(event, zod(loginSchema));
        if (!form.valid) {
            return fail(400, {
                form,
            });
        }
        return {
            form,
        };
    },
};

// export const actions = {
//     newAssessment: async (event: RequestEvent) => {

//         const form = await superValidate(event, zod(loginSchema));
//         if (!form.valid) {
//             return fail(400, {
//                 form,
//             });
//         }
//         console.log(form.data);

//         const response = await createUser(
//             form.data.firstname,
//             form.data.lastname,
//             form.data.email,
//             form.data.phone,
//             form.data.username,
//             form.data.password
//         );
//         console.log(chalk.hex('#09FA25')("This is from server", JSON.stringify(response), "page.server.ts file"));

//         if (response.Status === 'failure' || response.HttpCode !== 201) {
//             throw redirect(
//                 303,
//                 `/user`,
//             );
//         }
//         throw redirect(

//             303,
//             `/user`,

//         );
//     },
// } satisfies Actions;