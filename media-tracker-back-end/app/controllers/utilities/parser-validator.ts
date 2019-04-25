import { ClassType, transformAndValidate, TransformValidationOptions } from 'class-transformer-validator';

/**
 * Common parser/validator that contains some util methods for extending classes
 */
class ParserValidator {

	/**
	 * Helper to parse and validate the given object against the given class
	 * @param classType the class containing the object fields, with optional validation annotations
	 * @param source the source raw object
	 * @returns the parsed object, as a promise
	 */
	public parseAndValidate<T extends object>(classType: ClassType<T>, source: object): Promise<T> {

		return transformAndValidate(classType, source, this.getDefaultTransformValidationOptions());
	}

	/**
	 * Helper to get the transfor-validation options
	 */
	private getDefaultTransformValidationOptions(): TransformValidationOptions {

		return {
			transformer: {
				strategy: 'exposeAll'
			},
			validator: {
				skipMissingProperties: false,
				forbidNonWhitelisted: true,
				forbidUnknownValues: true
			}
		};
	}
}

/**
 * Singleton instance of the parser/validator
 */
export const parserValidator = new ParserValidator();
