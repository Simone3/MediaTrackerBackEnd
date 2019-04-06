import { AppError } from "../error/error";

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
	message?: string;
};

/**
 * Generic response for a failure outcome
 */
export class ErrorResponse extends CommonResponse {

	/**
	 * A unique error code, should never be displayed to the user
	 */
	errorCode: string;

	/**
	 * An error description, should never be displayed to the user
	 */
	errorDescription: string;

	/**
	 * Optional details for the error, should never be displayed to the user
	 */
	errorDetails?: any;

	constructor(error: AppError) {

		super();
		this.errorCode = error.errorCode;
		this.errorDescription = error.errorDescription;
		this.errorDetails = error.errorDetails;
	}
}
