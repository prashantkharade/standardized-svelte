import type { RequestEvent } from '@sveltejs/kit';
import chalk from 'chalk';
import { createSubmission } from '../../services/submission';

//////////////////////////////////////////////////////////////

export const POST = async (event: RequestEvent) => {
    const request = event.request;
    const data = await request.json();
    console.log(chalk.hex('#00f0ff')(data))

    // console.log(`${event} this is data`)

    try {
        const response = await createSubmission(
            data.templateId,
        );
		console.log(chalk.hex('#00f000')(JSON.stringify(response),"this is submissionlink"))

        return new Response(JSON.stringify(response));
    } catch (err) {
        console.error(`Error fetching the submission: ${err.message}`);
        return new Response(err.message);
    }
};


