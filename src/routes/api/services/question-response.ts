import { BACKEND_API_URL } from "$env/static/private";
import { post_ } from "./common";

export const createQuestionResponse = async (
	FormSubmissionId: string,
	Data: { [key: string]: string }
) => {
	const body = {
		FormSubmissionId: FormSubmissionId,
		Data: Data
	};

	const url = BACKEND_API_URL + `/question-responses/save`;
	return await post_(url, body);
};