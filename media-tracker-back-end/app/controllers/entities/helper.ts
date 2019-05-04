import { AppError } from 'app/models/error/error';
import { PersistedEntityInternal } from 'app/models/internal/common';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Helper controller for enities, with util methods
 */
export abstract class AbstractEntityController {

	/**
	 * Helper to perform a (possibly) multiple collection cleanup with an optional emptiess check
	 * @param forceEvenIfNotEmpty if true the checkCallback will not be performed and the deleteCallback will be executed, if false the checkCallback is executed
	 *                            and an error is thrown if it returns a non-empty array
	 * @param checkCallback the callback for the emptiness check promise
	 * @param deleteCallback the callback for the delete promises
	 */
	protected async cleanupWithEmptyCheck<T>(forceEvenIfNotEmpty: boolean, checkCallback: () => Promise<T[]>, deleteCallback: () => Promise<number[] | number>[]): Promise<number> {

		try {

			// Emptiness check if the user did not decide to force the cleanup
			if(!forceEvenIfNotEmpty) {

				const arrayToCheck = await checkCallback();

				if(arrayToCheck.length > 0) {
	
					throw AppError.DATABASE_DELETE_NOT_EMPTY;
				}
			}

			// Perform the cleanup
			return miscUtils.mergeAndSumPromiseResults(...deleteCallback());
		}
		catch(error) {

			throw AppError.DATABASE_DELETE.withDetails(error);
		}
	}

	/**
	 * Helper to check that one or more persisted entities exist
	 * @param errorToThrow the error to throw if preconditions fail
	 * @param checkCallback callback that returns a promise containing either undefined (= no entity found = precondition fail), a single entity (= entity found =
	 *                      precondition pass) or an array of possibly undefined entities (if all defined, = precondition pass; if at least one undefined, =
	 *                      precondition fail)
	 */
	protected checkExistencePreconditionsHelper(errorToThrow: AppError, checkCallback: () => Promise<PersistedEntityInternal | undefined | (PersistedEntityInternal | undefined)[]>): Promise<void> {
		
		return new Promise((resolve, reject): void => {

			checkCallback()
				.then((result) => {

					if(result) {

						if(result instanceof Array) {

							for(const resultValue of result) {

								if(!resultValue) {

									// At least one of the elements in the result array is undefined, KO
									reject(errorToThrow);
									return;
								}
							}

							// All elements of the result array are defined, OK
							resolve();
						}
						else {

							// The single result element is defined, OK
							resolve();
						}
					}
					else {

						// The single result element is undefined, KO
						reject(errorToThrow);
					}
				})
				.catch((error) => {

					// Generic error, KO
					reject(errorToThrow.withDetails(error));
				});
		});
	}
}
