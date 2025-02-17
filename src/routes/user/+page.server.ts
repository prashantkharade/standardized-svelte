import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userLogin } from '../api/services/user';

////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async () => {
	try {
		const response = await userLogin();
		// chalk.red(console.log("This is response from user", response))
		return {
			response
		}
	} catch (error) {
		console.error(`Error retrieving data : ${error.message}`);
		throw redirect(303, '/');
	}
};

//////////////////////////////////////////////////////////////////////////////////////////

export const actions = {
	login: async (event: RequestEvent) => {

		const request = event.request;
		const data = await request.formData();

		console.log(Object.fromEntries(data));
        
		const response = await userLogin();
		console.log("data", data);
		// console.log("response", response);
		const user = response.Data;
		console.log("user login data ", user)

		const username = data.has('username') ? (data.get('username') as string) : null;
		const password = data.has('password') ? (data.get('password') as string) : null;

		if (!username || !password) {
			throw error(400, `Username or password are not valid!`);
		}

		user.forEach((element: { Username: string; Password: string; id: unknown; }) => {
			if (element.Username == username && element.Password === password) {
				throw redirect(303, `/user/${element.id}`);
			}
		});

	}
};
