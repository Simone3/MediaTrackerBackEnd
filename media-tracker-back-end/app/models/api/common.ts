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
};

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
		this.errorCode = error.errorCode;
		this.errorDescription = error.errorDescription;
		this.errorDetails = error.errorDetails;
	}
}

/**
 * Type that can be extended by insert or update API requests for common fields
 */
export class CommonSaveRequest {

	/**
	 * If true, the element is allowed to have the same name of another existing element
	 */
	@IsOptional()
	@IsBoolean()
	public allowSameName?: boolean;
}



