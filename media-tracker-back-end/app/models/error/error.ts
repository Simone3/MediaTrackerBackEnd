/**
 * An application error that can be thrown or promise-rejected in the code and then handled in a response with negative outcome
 */
export class AppError {

	public static GENERIC = new AppError('generic.application', 'Generic application error');
	public static NOT_FOUND = new AppError('api.not.found', 'Cannot find the requested API');
	public static INVALID_REQUEST = new AppError('request.invalid', 'Validation error on the API request');
	public static DATABASE_INIT = new AppError('db.connection', 'Initial connection to the database cannot be established');
	public static DATABASE_FIND = new AppError('db.find', 'Database find query returned an error');
	public static DATABASE_SAVE = new AppError('db.save', 'Database save query returned an error');
	public static DATABASE_SAVE_UNIQUENESS = new AppError('db.save.uniqueness', 'Cannot save element because one or more field values are already present in the database');
	public static DATABASE_DELETE = new AppError('db.delete', 'Database delete query returned an error');
	public static DATABASE_DELETE_NOT_EMPTY = new AppError('db.delete.not.empty', 'The entity that is being deleted contains sub-items');
	public static EXTERNAL_API_INVOKE = new AppError('external.api.invocation', 'External API invocation returned an error');
	public static EXTERNAL_API_TIMEOUT = new AppError('external.api.timeout', 'External API invocation timed out');
	public static EXTERNAL_API_PARSE = new AppError('external.api.parsing', 'Cannot parse external API response');
	public static EXTERNAL_API_GENERIC = new AppError('external.api.generic', 'Generic error while invoking external API');

	private _errorCode: string;
	private _errorDescription: string;
	private _errorDetails?: string;

	constructor(errorCode: string, errorDescription: string, errorDetails?: string) {
		
		this._errorCode = errorCode;
		this._errorDescription = errorDescription;
		this._errorDetails = errorDetails;
	}

	/**
	 * The error code
	 */
	public get errorCode(): string {

		return this._errorCode;
	}

	/**
	 * The error description
	 */
	public get errorDescription(): string {

		return this._errorDescription;
	}

	/**
	 * The optional error details
	 */
	public get errorDetails(): string | undefined {

		return this._errorDetails;
	}

	/**
	 * Adds details to an error constant
	 */
	public withDetails(errorDetails?: any): AppError {

		return new AppError(this.errorCode, this.errorDescription, (errorDetails ? '' + errorDetails : ''));
	}

	/**
	 * If "error" is an AppError, returns it: otherwise returns this element with "error" as details
	 */
	public unlessAppError(error: any): AppError {

		if(error && error instanceof AppError) {

			return error;
		}
		else {

			return this.withDetails(error);
		}
	}
}