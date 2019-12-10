import { AppError } from 'app/data/models/error/error';
import { PersistedEntityInternal } from 'app/data/models/internal/common';

/**
 * Helper controller for enities, with util methods
 */
export abstract class AbstractEntityController {
	
	/**
	 * Helper to check that one or more persisted entities exist
	 * @param errorToThrow the error to throw if preconditions fail
	 * @param checkCallback callback that returns a promise containing either undefined (= no entity found = precondition fail), a single entity (= entity found =
	 * precondition pass) or an array of possibly undefined entities (if all defined, = precondition pass; if at least one undefined, =
	 * precondition fail)
	 * @returns a void promise that resolves if the entity exists
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

	/**
	 * Helper to extract the ID from an entity
	 * @param entity a string (it's already the ID) or a PersistedEntityInternal (from which the ID will be extracted)
	 * @returns the ID, as a string
	 */
	protected getEntityStringId(entity: PersistedEntityInternal | string): string {

		return typeof entity === 'string' ? entity : String(entity._id);
	}
}
