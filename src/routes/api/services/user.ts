import { BACKEND_API_URL } from '$env/static/private';
import { get_ } from './common';
////////////////////////////////////////////////////////////////

export const userLogin = async () => {
	const url = BACKEND_API_URL + `/users/all`;
	return await get_(url);
}