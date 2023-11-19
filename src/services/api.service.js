import { HttpService } from './http.service.js';

class ApiService extends HttpService {
    /**
     * @return {!ApiService}
     */
    constructor(params) {
        super();

        /**
         * @private
         * @constant
         * @type {string}
         */
        this.API_URL = params.url;

        /**
         * @private
         * @constant
         * @type {!Set<string>}
         */
        this.mandatoryKeys = params.mandatoryKeys;

        /**
         * @protected
         * @constant
         * @type {!Object}
         */
        this.defaultKeys = params.defaultKeys;

        /**
         * @protected
         * @constant
         * @type {!Map<string, string>}
         */
        this.routeMap = params.routeMap;
    }

    /**
     * @type {{replaceRoute: string, params: !Object, useDefaultKeys: boolean[true]}} options
     * @return {string}
     */
    buildUrlFromParams(options) {
        const { replaceRoute, params, useDefaultKeys } = options;

        // Combine default keys with user params
        const allParams = useDefaultKeys ? { ...params, ...this.defaultKeys } : params;

        // Replace app route with api route
        const route = this.routeMap.get(replaceRoute);

        // Get full url
        const url = new URL(`${this.API_URL}${route}`);

        // Append params
        url.search = new URLSearchParams(allParams).toString();

        // Retrieve as a string
        return url.toString();
    }
}

export { ApiService };
