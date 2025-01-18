import { error } from '@sveltejs/kit';
import chalk from 'chalk';

/////////////////////////////////////////////////////////////////////////

const headers = {
    'Content-Type': 'application/json'
};

interface ApiResponse {
    Status: 'success' | 'failure';
    HttpCode: number;
    Message: string;
}

export const get_ = async (url: string) => {
    try {
        console.log(chalk.hex('#FFA500')(`GET Request URL: ${url}`));

        const res = await fetch(url, { method: 'GET', headers });
        const response = await res.json();

        handleResponse(response, url, 'GET');

        return response;
    } catch (err) {
        handleError(err, url, 'GET');
        throw error(500, 'An error occurred while processing the GET request');
    }
};

export const post_ = async (url: string, bodyObj: unknown) => {
    try {
        console.log(chalk.hex('#FFA500')(`POST Request URL: ${url}`));
        console.log(chalk.hex('#FFA504')(`POST Request Body: ${JSON.stringify(bodyObj)}`));

        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj)
        });
        const response = await res.json();

        handleResponse(response, url, 'POST');

        return response;
    } catch (err) {
        handleError(err, url, 'POST');
        throw error(500, 'An error occurred while processing the POST request');
    }
};

export const put_ = async (url: string, bodyObj: unknown) => {
    try {
        console.log(chalk.hex('#FFA500')(`PUT Request URL: ${url}`));
        console.log(chalk.hex('#e1ff00')(`PUT Request Body: ${JSON.stringify(bodyObj)}`));

        const res = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(bodyObj)
        });
        const response = await res.json();

        handleResponse(response, url, 'PUT');

        return response;
    } catch (err) {
        handleError(err, url, 'PUT');
        throw error(500, 'An error occurred while processing the PUT request');
    }
};

export const delete_ = async (url: string) => {
    try {
        console.log(chalk.red(`DELETE Request URL: ${url}`));

        const res = await fetch(url, {
            method: 'DELETE',
            headers
        });
        const response = await res.json();

        handleResponse(response, url, 'DELETE');

        return response;
    } catch (err) {
        handleError(err, url, 'DELETE');
        throw error(500, 'An error occurred while processing the DELETE request');
    }
};

const handleResponse = (response: ApiResponse, url: string, method: string): void | null => {
    if (response.Status === 'failure') {
        if (response.HttpCode === 404) {
            console.log(chalk.red(`${method} ${url} - 404: ${response.Message}`));
            return null;
        }
        console.log(chalk.blue(`${method} ${url} - ${response.HttpCode}: ${response.Message}`));
        throw error(response.HttpCode, response.Message);
    }

    console.log(chalk.green(`${method} ${url} - Success: ${response.Message}`));
};

const handleError = (err: unknown, url: string, method: string): void => {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(chalk.red(`${method} ${url} - Error: ${errorMessage}`));
};
