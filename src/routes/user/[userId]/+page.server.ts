import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad, RequestEvent } from "./$types";
import { createFormTemplate, getFormTemplateByUserId } from '../../api/services/form-template';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import { createSection } from '../../../routes/api/services/section';
import { superValidate } from "sveltekit-superforms";
import { fail } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { assessmentSchema } from './assessment-schema';
////////////////////////////////////////////////////////

export const load: PageServerLoad = async ({ depends, params }) => {
	const { userId } = params;
	// const userId = event.params.userId;
	depends('app:assessmentTemplate')
	try {
		const response = await getFormTemplateByUserId(userId);
		console.log(chalk.red(JSON.stringify(response)))
		const assessmentTemplate = response.Data.Items;
		return {
			assessmentTemplate,
			message: response.Message,
			assessmentSchema: await superValidate(zod(assessmentSchema)),
		};
	} catch (error) {
		console.error(`Error retriving assessment templates: ${error.message}`);
	}
};

// const createFormTemplateSchema = zfd.formData({
// 	title: z.string().min(3).max(256),
// 	description: z.string().optional(),
// 	currentVersion: zfd.numeric().optional(),
// 	type: z.string(),
// 	displayCode: z.string().optional(),
// 	defaultSectionNumbering: zfd.checkbox().optional(),
// });

export const actions = {
	newAssessment: async (event: RequestEvent) => {

		const form = await superValidate(event, zod(assessmentSchema));
		if (!form.valid) {
			return fail(400, {
				form,
			});
		}
		// const request = event.request;
		const userId = event.params.userId;
		// // console.log("User id from new : ", userId)
		// // const sessionId = event.cookies.get('sessionId');
		// const formData = Object.fromEntries(await request.formData());
		// // console.log(formData, "this is form data")

		// type formTemplateSchema = z.infer<typeof createFormTemplateSchema>;
		// let result: formTemplateSchema = {};

		// try {
		// 	result = createFormTemplateSchema.parse(formData);
		// 	// console.log(result,"reesult in try")
		// } catch (err) {
		// 	const { fieldErrors: errors } = err.flatten();
		console.log(form.data);
		// 	const { ...rest } = formData;
		// 	return {
		// 		data: rest,
		// 		errors
		// 	};
		// }




		const rootSectionId = "9618c6a8-0555-4a14-95ec-1946ec09c8e0";
		const response = await createFormTemplate(
			form.data.title,
			form.data.description,
			form.data.currentVersion,
			form.data.type,
			userId,
			rootSectionId,
			form.data.defaultSectionNumbering
		);
		console.log(chalk.hex('#09FA25')("This is from server", JSON.stringify(response), "page.server.ts file"));

		const parentSectionId = uuidv4();
		const templateId = response.Data.id;
		const title = "Assessment Root Section";
		const description = "Root section";
		const sectionIdentifier = "Root Section"
		const sequence = "A1";

		const rootSection = await createSection(
			templateId,
			parentSectionId,
			title,
			description,
			sectionIdentifier,
			sequence,
		);
		console.log(chalk.hex('#6a329f')('Response from section server', rootSection));

		if (response.Status === 'failure' || response.HttpCode !== 201) {
			throw redirect(
				303,
				`/users/${userId}/new`,
			);
		}
		throw redirect(

			303,
			`/users/${userId}/new/${templateId}/question`,

		);
	},
} satisfies Actions;


