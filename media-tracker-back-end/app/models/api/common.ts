import { AppError } from 'app/models/error/error';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * Type shared by all API requests
 */
export class CommonRequest {

}

/**
 * Type shared by all API responses
 */
export class CommonResponse {

	/**
	 * A generic message for easy response reading, should never be displayed to the user
	 */
	public message?: string;
}

/**
 * Generic response for a failure outcome
 */
export class ErrorResponse extends CommonResponse {

	/**
	 * A unique error code, should never be displayed to the user
	 */
	public errorCode: string;

	/**
	 * An error description, should never be displayed to the user
	 */
	public errorDescription: string;

	/**
	 * Optional details for the error, should never be displayed to the user
	 */
	public errorDetails?: string | AppError;
	
	/**
	 * Constructor
	 * @param error the source error object
	 */
	public constructor(error: AppError) {

		super();

		const sourceError = this.getSourceAppError(error);
		
		this.errorCode = sourceError.errorCode;
		this.errorDescription = sourceError.errorDescription;
		this.errorDetails = sourceError.errorDetails;
	}

	/**
	 * Helper to extract the source error from the stack of AppErrors
	 */
	private getSourceAppError(error: AppError): AppError {

		let currentError: AppError = error;

		while(currentError.errorDetails && currentError.errorDetails instanceof AppError) {

			currentError = error.errorDetails as AppError;
		}

		return currentError;
	}
}

/**
 * Type that can be extended by insert or update API requests for common fields
 */
export class CommonSaveRequest extends CommonRequest {

	/**
	 * If true, the element is allowed to have the same name of another existing element
	 */
	@IsOptional()
	@IsBoolean()
	public allowSameName?: boolean;
}

/**
 * Type that can be extended by "add new" APIs to return the new entity ID
 */
export class CommonAddResponse extends CommonResponse {

	/**
	 * The new element unique ID
	 */
	public uid!: string;
}
