/**
 * Some utilities for enums
 */
class EnumUtils {
	
	/**
	 * Gets an array of string values for an enum (valid for NUMERIC enums only)
	 * @param theEnum the enum
	 * @returns the array of string names
	 * @template T the enum
	 */
	public getEnumStringValues<T>(theEnum: T): string[] {

		const result = [];
		for(const enumKey in theEnum) {

			if(isNaN(Number(enumKey))) {
				
				result.push(enumKey);
			}
		}
		return result;
	}
	
	/**
	 * Gets an array of enum values for an enum (valid for NUMERIC enums only)
	 * @param theEnum the enum
	 * @returns the array of enum values
	 * @template T the enum
	 */
	public getEnumValues<T>(theEnum: T): T[keyof T][] {

		const result = [];
		for(const enumStringKey in theEnum) {
			
			if(isNaN(Number(enumStringKey))) {

				const enumKeyOf = enumStringKey as keyof typeof theEnum;
				result.push(theEnum[enumKeyOf]);
			}
		}
		return result;
	}
}

/**
 * Singleton implementation of enum utils
 */
export const enumUtils = new EnumUtils();
