import { BACKEND_API_URL } from "$env/static/private";
import { get_, post_ } from "./common";

//////////////////////////////////////////////////////////////////
export const getSectionById = async (
	sectionId: string
) => {	
	const url = BACKEND_API_URL + `/form-sections/${sectionId}`;
	return await get_(url);
};


export const createSection = async (
	parentTemplateId: string,
	parentSectionId: string,
	title: string,
	description?: string,
	sectionIdentifier?: string,
	sequence?: string,
) => {
	const body = {
		ParentFormTemplateId: parentTemplateId,
		SectionIdentifier: sectionIdentifier,
		Title: title,
		Description: description ? description : null,
		Sequence: sequence,
		ParentSectionId: parentSectionId ? parentSectionId : null,
	};

	const url = BACKEND_API_URL + `/form-sections`;
	return await post_(url, body);
};

export const getSectionByTemplateId = async (
	searchParams?: any
) => {	
	let searchString = '';
	if (searchParams) {
		const keys = Object.keys(searchParams);
		if (keys.length > 0) {
			searchString = '?';
			const params = [];
			for (const key of keys) {
				if (searchParams[key]) {
					const param = `${key}=${searchParams[key]}`;
					params.push(param);
				}
			}
			searchString += params.join('&');
		}
	}
	const url = BACKEND_API_URL + `/form-sections/search${searchString}`;
	return await get_(url);
};