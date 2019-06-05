import { ErrorResponse } from 'app/models/api/common';
import { AppError } from 'app/models/error/error';

/**
 * Helper factory to build an ErrorResponse object. A factory was chosen instead of a constructor to keep the model class
 * unaware of the internal error source.
 */
class ErrorResponseFactory {

	/**
	 * Builds an error response
	 * @param error the source data
	 * @returns the error response
	 */
	public from(error: AppError): ErrorResponse {

		const sourceError = this.getSourceAppError(error);
		
		return {
			errorCode: sourceError.errorCode,
			errorDescription: sourceError.errorDescription,
			errorDetails: sourceError.errorDetails as string
		};
	}

	/**
	 * Helper to extract the source error from the stack of AppErrors
	 * @param error the final error
	 * @returns the first error of the nested chain
	 */
	private getSourceAppError(error: AppError): AppError {

		let currentError: AppError = error;

		while(currentError.errorDetails && currentError.errorDetails instanceof AppError) {

			currentError = currentError.errorDetails as AppError;
		}

		return currentError;
	}
}

/**
 * Singleton implementation of the ErrorResponseFactory
 */
export const errorResponseFactory = new ErrorResponseFactory();
