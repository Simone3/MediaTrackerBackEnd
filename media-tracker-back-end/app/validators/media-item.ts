import { transformAndValidate } from 'class-transformer-validator';
import { AddMediaItemRequest } from "../models/api/add-media-item";

/**
 * Parser/validator for public media item API inputs
 */
class MediaItemValidator {

	/**
	 * Parses and validates the API input
	 */
	public parseAndValidateAddMediaItemRequest(source: object): Promise<AddMediaItemRequest> {

		return transformAndValidate(AddMediaItemRequest, source, {
			transformer: {
				strategy: "exposeAll"
			},
			validator: {
				skipMissingProperties: false,
				forbidNonWhitelisted: true,
				forbidUnknownValues: true
			}
		});
	}
}

/**
 * Singleton instance of the media item parser/validator
 */
export const mediaItemValidator = new MediaItemValidator();