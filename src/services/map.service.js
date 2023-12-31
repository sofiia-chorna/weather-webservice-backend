import { ENV, HTTP_HEADER, HTTP_METHOD, LANG, MAP_API_PATH } from '../common/common.js';
import { ApiService } from './abstract/api.service.js';
import { getCountryNameByCode } from '../helpers/helpers.js';

class MapService extends ApiService {
    /**
     * @return {!MapService}
     */
    constructor() {
        super({
            url: ENV.API.MAP.API_PATH,
            defaultKeys: {
                ['appid']: ENV.API.MAP.KEY,
                ['lang']: LANG.EN,
            },
            routeMap: new Map([
                [MAP_API_PATH.ADDRESS, '/reverse'],
            ]),
        });
    }

    /**
     * @param {!Object} options
     * @return {!Promise<!Object>}
     */
    async getAddress(options) {
        const url = this.buildUrlFromParams({
            replaceRoute: MAP_API_PATH.ADDRESS,
            params: options,
            useDefaultKeys: true,
        });

        // Run request
        const response = await this.request({
            url: url,
            method: HTTP_METHOD.GET,
            headers: { [HTTP_HEADER.KEY.CONTENT_TYPE]: HTTP_HEADER.VALUE.APPLICATION_JSON },
        });

        // Correct response
        if (Array.isArray(response) && response.length > 0) {
            const firstEntry = response[0];
            const country = getCountryNameByCode(firstEntry.country);
            return {
                country: country,
                city: firstEntry.name,
                state: firstEntry.state ?? firstEntry.name,
                formatted: `${country}, ${firstEntry.state ?? firstEntry.name}, ${firstEntry.name ?? firstEntry.state}`,
                lat: firstEntry.lat,
                lon: firstEntry.lon,
            };
        }

        // API error
        return this.createError(response.cod || response.code, response.message);
    }
}

// Singleton instance
const mapService = new MapService();

export { mapService };
