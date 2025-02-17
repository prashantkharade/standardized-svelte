import type { RequestEvent } from '@sveltejs/kit';
import { getQuestionsByTemplateId } from '../../../services/question';
import chalk from 'chalk';
import { getSectionByTemplateId } from '../../../services/section';
import { getFormTemplateById } from '../../../services/form-template';

//////////////////////////////////////////////////////////////

export const GET = async (event: RequestEvent) => {
    // const templateId = event.params.templateId;
    try {
        // const id= event.params.templateId
        const templateId = { parentTemplateId: event.params.templateId };
        // console.log(chalk.hex('#FF00FF')("This is template id", JSON.stringify(templateId)));
        const response = await getQuestionsByTemplateId(templateId);
        // console.log((chalk.hex('#00ffff'))(JSON.stringify(response)));
        // const items = JSON.stringify(response);
        const templateSectionId = { parentFormTemplateId: event.params.templateId };
        const res = await getSectionByTemplateId(templateSectionId);
        // console.log((chalk.hex('#09FA25'))(JSON.stringify(res)));
        const templateformId = { id: event.params.templateId };
        const temp = await getFormTemplateById(templateformId);
        // console.log((chalk.hex('#ff0000'))(JSON.stringify(temp)));

        return new Response(JSON.stringify({
            questions: response,
            sections: res,
            templates: temp
        }));
        // return items
    } catch (err) {
        console.error(`Error retriving assessment node: ${err.message}`);
        return new Response(err.message);
    }
};
