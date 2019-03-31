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
}

/**
 * Singleton implementation of the misc utilities controller
 */
export const miscUtilsController = new MiscUtilsController();
