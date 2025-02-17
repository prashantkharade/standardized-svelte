import type { RequestEvent } from '@sveltejs/kit';
import chalk from 'chalk';
import { createQuestionResponse } from '../../services/question-response';


//////////////////////////////////////////////////////////////

export const POST = async (event: RequestEvent) => {
    const request = event.request;
    const data = await request.json();
    console.log(chalk.hex('#00f0ff')(JSON.stringify(data)))

    // console.log(`${event} this is data`)

    try {
        const response = await createQuestionResponse(
            data.FormSubmissionId,
            data.Data
        );
		// console.log(chalk.hex('#00f000')(JSON.stringify(response),"this is submissionlink"))

        return new Response(JSON.stringify(response));
    } catch (err) {
        console.error(`Error fetching the submission: ${err.message}`);
        return new Response(err.message);
    }
};


