import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit';
import { createQuestionNode, getQuestionsByTemplateId } from '../../../api/services/question';
import type { PageServerLoad } from './$types';
import { getFormTemplateById } from '../../../api/services/form-template';
import chalk from 'chalk';
// import { createSection, getSectionByTemplateId } from '../../../../../api/services/section';
import { sectioSchema } from "./section-schema";
import { questionSchema } from "./question-schema";
import { superValidate } from "sveltekit-superforms";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { createSection, getSectionByTemplateId } from '../../../api/services/section';
//////////////////////////////////////////////////////////////////////////////////////////


export const load: PageServerLoad = async (event: ServerLoadEvent) => {

	const { userId } = event.params;
	event.depends('app:allNodes')

	try {
		const assessmentTemplateId = event.params.assessmentId;
		const searchParams = {
			id: assessmentTemplateId,
			ownerUserId: userId
		};
		const searchParam = {
			parentFormTemplateId: assessmentTemplateId
		}
		const searchParamQuestion = {
			parentTemplateId: assessmentTemplateId
		}

		const response = await getFormTemplateById(searchParams);


		const _section = await getSectionByTemplateId(searchParam);


		const _assessmentNodes = await getQuestionsByTemplateId(searchParamQuestion);

		if (response.Status === 'failure' || response.HttpCode !== 200) {
			throw error(response.HttpCode, response.Message);
		}

		const assessmentTemplate = response.Data.Items;

		const assessmentNodes = _assessmentNodes.Data.Items;

		const sections = _section.Data.Items;

		return {
			sections,
			assessmentTemplateId,
			assessmentTemplate,
			assessmentNodes,
			sectionForm: await superValidate(zod(sectioSchema)),
			questionForm: await superValidate(zod(questionSchema)),
			message: response.Message
		};
	} catch (error) {
		console.error(`Error retriving assessment templates: ${error.message}`);
	}
};


// const createQuestionSchema = zfd.formData({
// 	parentSectionId: z.string(),
// 	title: z.string().min(8).max(256),
// 	description: z.string().optional(),
// 	responseType: z.string(),
// 	score: zfd.numeric(z.number().default(0)).optional(),
// 	correctAnswer: z.string().optional(),
// 	hint: z.string().optional(),
// 	questionImageUrl: z.string().optional(),
// 	rangeMin: zfd.numeric(z.number().default(1)).optional(),
// 	rangeMax: zfd.numeric(z.number().default(2)).optional(),
// 	options: z.array(z.string()).optional()
// 	// options: z.string().optional()
// });

// const createSectionSchema = zfd.formData({
// 	title: z.string().min(8).max(256),
// 	parentSectionId: z.string(),
// 	description: z.string().optional(),
// 	sectionIdentifier: z.string().optional(),
// 	sequence: z.string().optional(),
// });

export const actions = {
	createQuestion: async (event: RequestEvent) => {
		console.log('result is ');
		// const request = event.request;
		const userId = event.params.userId;
		const ParentTemplateId = event.params.assessmentId;

		const form = await superValidate(event, zod(questionSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		console.log("This is form data", form.data);
		// const data = await request.formData();
		// const options = data.has('options') ? data.getAll('options') : [];
		// const formData = Object.fromEntries(data);
		// const formDataValue = { ...formData, options: options };
		// // const formData = Object.fromEntries(data);

		// console.log('result', formDataValue);

		// type AssessmentNodeSchema = z.infer<typeof createQuestionSchema>;
		// let result: AssessmentNodeSchema = {};
		// try {
		// 	// result = createQuestionSchema.parse(formDataValue);
		// 	result = createQuestionSchema.parse(formDataValue);
		// 	// console.log('result', result);
		// } catch (err: any) {
		// 	const { fieldErrors: errors } = err.flatten();
		// 	console.log(errors);
		// 	const { ...rest } = formData;
		// 	return {
		// 		data: rest,
		// 		errors
		// 	};
		// }

		

		// // const opt = "option1, option2"
		// // const displayCode = '2b3b3ea7-d55f-46fb-901f-380a92be0059';
		const response = await createQuestionNode(
			ParentTemplateId,
			form.data.parentSectionId,
			form.data.title,
			form.data.description,
			form.data.responseType,
			form.data.score,
			form.data.correctAnswer,
			form.data.hint,
			form.data.questionImageUrl,
			form.data.rangeMin,
			form.data.rangeMax,
			form.data.options
		
		);

		// const nodeId = response.Data.AssessmentNode.id;

		console.log(chalk.hex('#6a329f')('response from question', response));

		if (response.Status === 'failure' || response.HttpCode !== 201) {
			throw redirect(303, `users/${userId}/new/${ParentTemplateId}`);
		}
		throw redirect(
			303,
			`/users/${userId}/new/${ParentTemplateId}/question`,

		);
	},

	createSection: async (event: RequestEvent) => {
		// const request = event.request;
		const userId = event.params.userId;
		const ParentTemplateId = event.params.assessmentId;

		const form = await superValidate(event, zod(sectioSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		console.log("This is form data", form.data);
		const response = await createSection(
			ParentTemplateId,
			form.data.parentSectionId,
			form.data.title,
			form.data.description,
			form.data.sectionIdentifier,
			form.data.sequence
		);
		console.log(chalk.hex('#09FA25')("this is from server", JSON.stringify(response), "page.server.ts file"));

		if (response.Status === 'failure' || response.HttpCode !== 201) {
			throw redirect(

				303, `users/${userId}/new/${ParentTemplateId}`
			);
		}
		throw redirect( 
			303,
			`/users/${userId}/new/${ParentTemplateId}/question`,

		);
		// const request = event.request;
		// const userId = event.params.userId;
		// const ParentTemplateId = event.params.assessmentId;
		// const data = await request.formData();
		// const formData = Object.fromEntries(data);

		// type AssessmentNodeSchema = z.infer<typeof createSectionSchema>;
		// console.log('result', formData);
		// let result: AssessmentNodeSchema = {};
		// try {
		// 	result = createSectionSchema.parse(formData);
		// 	console.log('result', result);
		// } catch (err: any) {
		// 	const { fieldErrors: errors } = err.flatten();
		// 	console.log(errors);
		// 	const { ...rest } = formData;
		// 	return {
		// 		data: rest,
		// 		errors
		// 	};
		// }
		// const response = await createSection(

		// 	ParentTemplateId,
		// 	result.parentSectionId,
		// 	result.title,
		// 	result.description,
		// 	result.sectionIdentifier,
		// 	result.sequence,
		// );
		// console.log(chalk.hex('#6a329f')('response from section server', response));

		// if (response.Status === 'failure' || response.HttpCode !== 201) {
		// 	throw redirect(303, `users/${userId}/new/${ParentTemplateId}`);
		// }
		// throw redirect(
		// 	303,
		// 	`/users/${userId}/new/${ParentTemplateId}/question`,

		// );
	}


};



