import type { RequestEvent } from '@sveltejs/kit';
import { deleteQuestion } from '../services/question';

//////////////////////////////////////////////////////////////

export const DELETE = async (event: RequestEvent) => {
	const request = event.request;
	const data = await request.json();
	// console.log(`${event} this is data`)

	try {
		const response = await deleteQuestion(
			data.questionId,
		);
		return new Response(response.message);
	} catch (err) {
		console.error(`Error deleting assessment node: ${err.message}`);
		return new Response(err.message);
	}
};


