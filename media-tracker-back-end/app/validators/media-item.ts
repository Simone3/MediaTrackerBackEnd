import { transformAndValidate, TransformValidationOptions } from 'class-transformer-validator';
import { AddMediaItemRequest } from "../models/api/add-media-item";
import { UpdateMediaItemRequest } from '../models/api/update-media-item';

/**
 * Parser/validator for public media item API inputs
 */
class MediaItemValidator {

	/**
	 * Parses and validates the API input
	 */
	public parseAndValidateAddMediaItemRequest(source: object): Promise<AddMediaItemRequest> {

		return transformAndValidate(AddMediaItemRequest, source, this.getDefaultTransformValidationOptions());
	}

	/**
	 * Parses and validates the API input
	 */
	public parseAndValidateUpdateMediaItemRequest(source: object): Promise<UpdateMediaItemRequest> {

		return transformAndValidate(UpdateMediaItemRequest, source, this.getDefaultTransformValidationOptions());
	}

	/**
	 * Helper
	 */
	private getDefaultTransformValidationOptions(): TransformValidationOptions {

		return {
			transformer: {
				strategy: "exposeAll"
			},
			validator: {
				skipMissingProperties: false,
				forbidNonWhitelisted: true,
				forbidUnknownValues: true
			}
		}
	}
}

/**
 * Singleton instance of the media item parser/validator
 */
export const mediaItemValidator = new MediaItemValidator();