/**
 * Util type for the keys map
 */
type RedactedMap = {
	[key: string]: boolean;
};

/**
 * Simple implementation of a log redactor
 */
class LogRedactor {

	/**
	 * Internal map of object keys to redact
	 */
	private readonly REDACTED_OBJECT_KEYS: RedactedMap = {
		'api_key': true,
		'key': true
	};

	/**
	 * Takes a value and transforms it into a string, removing defined redacted values
	 */
	public processAndStringify(value: unknown): string {
		
		if(value !== null && value !== undefined) {

			if(value instanceof Object) {

				if(value) {

					return JSON.stringify(value, (k, v) => {
							
						if(this.REDACTED_OBJECT_KEYS[k]) {
							
							return '********';
						}
						else {
		
							return v;
						}
					});
				}
			}
			else {

				return String(value);
			}
		}

		return '-';
	}
}

/**
 * Simple implementation of a log redactor
 */
export const logRedactor = new LogRedactor();