import { BACKEND_API_URL } from "$env/static/private";
import { get_, post_ } from "./common";

export const createSubmission = async (
	templateId: string,
) => {
	const body = {
		FormTemplateId: templateId,
	};

	const url = BACKEND_API_URL + `/form-submissions`;
	return await post_(url, body);
};

export const submit = async (
	submissionId :string,
) =>{
	const body ={};
	const url = BACKEND_API_URL + `/form-submissions/${submissionId}/submit`;
	return await post_(url,body);
}

export const getFormSubmission = async (
		submissionId :string,
	) =>{
		const url = BACKEND_API_URL + `/form-submissions/${submissionId}`;
		return await get_(url);
	}