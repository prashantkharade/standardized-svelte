import { type RequestEvent } from '@sveltejs/kit';
// import type { PageServerLoad } from './$types';
import type { PageServerLoad } from './$types';


////////////////////////////////////////////////////////////////////////////

export const load: PageServerLoad = async (event: RequestEvent) => {
    const sessionId = event.cookies.get('sessionId');
    console.log('sessionId', sessionId);

    try {
        // const userId = event.params.userId as string;
        // const columnId = event.params.columnId as string;
        // const entityId = event.params.modelId as string;
        // const serviceId = event.params.serviceId as string;

        // console.log('modelId', entityId);

        // const entityResponse = await getModelById(sessionId as string, entityId);
        // if (entityResponse.statusCode !== 200) {
        //     throw redirect(303, `/users/${userId}/services/${serviceId}/models`);
        // }
        // const entity = entityResponse.data;

        // const serviceResponse = await getServiceById(sessionId as string, serviceId);
        // if (serviceResponse.statusCode !== 200) {
        //     throw redirect(303, `/users/${userId}/services/${serviceId}/models/${entityId}`);
        // }
        // const service = serviceResponse.data;

        // const columnResponse = await getColumnById(sessionId as string, columnId);
        // if (columnResponse.statusCode !== 200) {
        //     throw redirect(303, `/users/${userId}/services/${serviceId}/models/${entityId}/columns`);
        // }
        // const column = columnResponse.data;
        
        // let enumerations: Enumeration[] = [];
        // const enumResponse = await searchEnums(sessionId as string, {});
        // if (enumResponse.statusCode !== 200) {
        //     throw redirect(303, '/users/' + userId + '/home');
        // }
        // const searchResults = enumResponse.data;
        // if (searchResults && searchResults.items) {
        //     enumerations = searchResults.items.map((item: any) => {
        //         return {
        //             id: item.id,
        //             name: item.name,
        //             description: item.description,
        //             enumValues: item.enumValues
        //         };
        //     });
        // }
        return {
            // column,
            // entity,
            // service,
            // sessionId,
            // enumerations,
            // message: entityResponse.Message
            message: ''
        };
    } catch (err: never) {
        console.error(`Error retriving model details: ${err.message}`);
    }
};

////////////////////////////////////////////////////////////////////////////

// export const actions = {
//     updateColumnAction: async (event: RequestEvent) => {
//         const request = event.request;
//         const userId = event.params.userId;
//         const serviceId = event.params.serviceId;
//         const entityId = event.params.modelId;
//         const columnId = event.params.columnId;
//         const sessionId = event.cookies.get('sessionId');

//         const { validationResult, validationErrors } = await validateForm(await request.formData());

//         if (validationErrors) {
//             return fail(422, {
//                 validationResult,
//                 validationErrors
//             });
//         }

//         if (!validationResult) {
//             return fail(400, { validationResult: null, validationErrors: errorMessage('Invalid data') });
//         }

//         let keywords: string[] = [];
//         if (validationResult?.keywordsStr && validationResult?.keywordsStr.length > 0) {
//             keywords = validationResult.keywordsStr?.split(', ');
//         }

//         let dataType: string = validationResult?.dataType as string;
//         if (dataType === 'String with finite length') {
//             dataType = 'StringFiniteLength';
//         }
//         if (dataType === 'Long string') {
//             dataType = 'LongString';
//         }

//         let validationType: string = (validationResult?.validationType as string) ?? 'None';
//         validationType = validationType.replace(/ /g, '');
//         validationType = validationType.replace(/-/g, '');

//         const response = await updateColumn(
//             sessionId as string,
//             columnId as string,
//             validationResult?.name as string,
//             validationResult?.description as string,
//             validationResult?.dataType as string,
//             (validationResult.nullable as boolean) ?? false,
//             (validationResult.defaultValue as string) ?? null,
//             (validationResult.unique as boolean) ?? false,
//             (validationResult.input as boolean) ?? false,
//             (validationResult.requiredInput as boolean) ?? false,
//             (validationResult.editable as boolean) ?? false,
//             (validationResult.output as boolean) ?? false,
//             (validationResult.index as boolean) ?? false,
//             validationType,
//             (validationResult.dataSize as number) ?? null,
//             (validationResult.min as number) ?? null,
//             (validationResult.max as number) ?? null,
//             (validationResult.queriable as boolean) ?? false,
//             (validationResult.allowPartialStringSearch as boolean) ?? false,
//             (validationResult.sortable as boolean) ?? false,
//             (validationResult.searchOutput as boolean) ?? false,
//             (validationResult.outputAsObject as boolean) ?? false,
//             (validationResult.enumerationId as string) ?? null,
//             (validationResult.example as string) ?? null,
//             keywords
//         );

//         if (response.status === 'failure' || response.statusCode !== 200) {
//             throw redirect(303, `/users/${userId}/services/${serviceId}/models/${entityId}/columns`);
//         }
//         throw redirect(303, `/users/${userId}/services/${serviceId}/models/${entityId}/columns`);
//     }
// };

