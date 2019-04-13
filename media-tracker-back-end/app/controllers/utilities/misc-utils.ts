/**
 * Enum for HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

/**
 * Helper controller that contains misc useful methods
 */
class MiscUtilsController {

	/**
	 * Helper to RegExp-escape a string
	 */
	public escapeRegExp(string: string): string {

		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	/**
	 * Helper to build a URL
	 * @param urlParts list of URL parts to be appended in order
	 * @param pathParams optional path params to replace in the full URL (the URL string must contain them in the ":" notation, e.g. http://mywebsite.com/:myPathParam/mypage)
	 */
	public buildUrl(urlParts: string[], pathParams?: PathParams) {

		// Empty case
		if(!urlParts || urlParts.length === 0) {
			return '';
		}
		
		// Build full URL
		let fullUrl = (urlParts[0] ? urlParts[0] : '');
		for (let i = 1; i < urlParts.length; i++) {

			if(urlParts[i] && urlParts[i].length > 0) {

				let fullEnds = fullUrl.endsWith('/');
				let partStarts = urlParts[i].startsWith('/');
				if(fullEnds && partStarts) {
					
					fullUrl = fullUrl + urlParts[i].substring(1);
				}
				else if(!fullEnds && !partStarts) {

					fullUrl = fullUrl + '/' + urlParts[i];
				}
				else {

					fullUrl = fullUrl + urlParts[i];
				}
			}
		}

		// Replace path params
		if(pathParams) {

			for(let key in pathParams) {

				fullUrl = fullUrl.replace(':' + key, pathParams[key]);
			}
		}
		
		return fullUrl;
	}

	/**
	 * Parses a boolean from a value of any type (e.g. the string "false" maps to the boolean false)
	 */
	public parseBoolean(value: any): boolean {

		if(typeof(value) === 'string') {

			value = value.trim().toLowerCase();
		}

		switch(value) {

			case true:
			case "true":
			case 1:
			case "1":
			case "on":
			case "yes":
				return true;

			default:
				return false;
		}
	}
}

/**
 * Singleton implementation of the misc utilities controller
 */
export const miscUtilsController = new MiscUtilsController();

/**
 * Helper type for URL path params
 */
export type PathParams = {
	[key: string]: string
};
