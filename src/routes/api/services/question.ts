import { BACKEND_API_URL } from '$env/static/private';
import chalk from 'chalk';
import { delete_, get_, post_, put_ } from './common';

////////////////////////////////////////////////////////////////

export const createQuestionNode = async (
	// sessionId: string,
	parentTemplateId: string,
	parentSectionId: string,
	title: string,
	description?: string,
	responseType?: string,
	score?: number,
	// displayCode?: string,
	correctAnswer?: string,
	hint?: string,
	questionImageUrl?: string,
	rangeMin?: number,
	rangeMax?: number,
	options?: string[],
	// options?: string,

) => {
	const body = {
		ParentTemplateId: parentTemplateId,
		ParentSectionId: parentSectionId,
		Title: title,
		Description: description ? description : null,
		ResponseType: responseType,
		Score: score ? score : null,
		// DisplayCode: displayCode ? displayCode : null,
		CorrectAnswer: correctAnswer ? correctAnswer : null,
		Hint: hint ? hint : null,
		QuestionImageUrl: questionImageUrl ? questionImageUrl : null,
		// RangeMin: rangeMin?rangeMin:null,
		if(rangeMin: any) {
			rangeMin
		},
		// if(rangeMax) {
		RangeMax: rangeMax,
		// },
		Options: options ? options : [],
	};

	const url = BACKEND_API_URL + `/questions`;
	// }
	return await post_(url, body);
};

export const getQuestionNodeById = async (
	nodeId: string
) => {
	console.log(`this is template id and this is node ${nodeId}`)
	const url = BACKEND_API_URL + `/questions/${nodeId}`;
	return await get_(url);
};

export const getQuestionsByTemplateId = async (
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
	console.log(`this is template id and this is node ${searchString}`)
	const url = BACKEND_API_URL + `/questions/search${searchString}`;
	const res = await get_(url);
	// console.log(res," this is result of node by templatet")
	return res
};

export const updateQuestion = async (
	qestionId: string,
	// parentTemplateId: string,
	// parentSectionId: string,
	title: string,
	description?: string,
	// displayCode?: string,
	responseType?: string,
	score?: number,
	correctAnswer?: string,
	hint?: string,
	questionImageUrl?: string,
	// options?: string[],
	rangeMin?: number,
	rangeMax?: number
) => {
	const body = {
		Title: title,
		Description: description ? description : null,
		ResponseType: responseType,
		Score: score ? score : null,
		CorrectAnswer: correctAnswer ? correctAnswer : null,
		Hint: hint ? hint : null,
		QuestionImageUrl: questionImageUrl ? questionImageUrl : null,
		RangeMin: rangeMin ? rangeMin : null,
		RangeMax: rangeMax ? rangeMax : null,
	};

	const url = BACKEND_API_URL + `/questions/${qestionId}`;
	return await put_(url, body);
};

export const deleteQuestion = async (
	questionId: string,
) => {
	console.log(chalk.red("questionId to delete.........................?", questionId))

	const url = BACKEND_API_URL + `/questions/${questionId}`;
	return await delete_(url);
};




