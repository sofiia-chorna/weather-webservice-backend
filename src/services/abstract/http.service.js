import { HTTP_CODE, HTTP_MESSAGE } from '../../common/common.js';

class HttpService {
    /**
     * @param {!Object} params
     * @return {!Promise<!Object>}
     */
    async request(params) {
        const { url, body, method, headers } = params;
        try {
            // TODO meaningfull logging
            console.log("Requested URL: ", url);

            // Run request
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: body
            });

            // Convert to json
            const responseObject = await response.json();

            // Handle API error
            if (responseObject.statusCode === HTTP_CODE.INTERNAL_SERVER_ERROR) {
                return { statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR, message: responseObject.message };
            }

            return responseObject;
        }
        // Error while fetching
        catch (error) {
            console.error(error);
            return { statusCode: HTTP_CODE.INTERNAL_SERVER_ERROR, message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR };
        }
    }
}

export { HttpService };
