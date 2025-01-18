import { BACKEND_API_URL } from '$env/static/private';
import { get_ } from './common';
////////////////////////////////////////////////////////////////

export const userLogin = async () => {
	const url = BACKEND_API_URL + `/users/all`;
	// const url = BACKEND_API_URL + `/users/search`;
	return await get_(url);
}