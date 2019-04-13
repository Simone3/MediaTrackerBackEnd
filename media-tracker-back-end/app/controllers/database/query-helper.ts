import { Document, Model, CollationOptions } from "mongoose";
import { AppError } from "../../models/error/error";
import { PersistedEntityInternal } from "../../models/internal/common";
import { logger } from "../../loggers/logger";

/**
 * Collation search options (for case insensitive ordering)
 */
const COLLATION: CollationOptions = {
	locale: 'en'
};

/**
 * Helper controller that contains util methods for database manipulation
 */
class QueryHelper {

	/**
	 * Helper to get from the database all elements of a model
	 * @param databaseModel the database model
	 * @param conditions optional query conditions
	 * @param sortBy optional sort conditions
	 * @param populate list of "joined" columns to populate
	 * @return a promise that will eventually contain the list of all internal model representations of the persisted elements
	 */
	public find<I extends PersistedEntityInternal, D extends Document & I, M extends Model<D>>(databaseModel: M, conditions?: Queryable<I>, sortBy?: Sortable<I>, populate?: Populatable<I>): Promise<I[]> {

		return new Promise((resolve, reject) => {

			const query = databaseModel
				.find(conditions)
				.collation(COLLATION)
				.sort(sortBy);

			if(populate) {

				for(let populateField in populate) {

					if(populate[populateField]) {
						
						query.populate(populateField);
					}
				}
			}

			query
				.then((documents: D[]) => {

					resolve(documents);
				})
				.catch((error: any) => {

					logger.error('Database find error: %s', error);
					reject(AppError.DATABASE_FIND.unlessAppError(error));
				});
		});
	}

	/**
	 * Helper to get from the database a single element of a model. If more than one element matches the conditions, an error is thrown.
	 * @param databaseModel the database model
	 * @param conditions optional query conditions
	 * @param populate list of "joined" columns to populate
	 * @return a promise that will eventually contain the internal model representation of the persisted element, or undefined if not found
	 */
	public findOne<I extends PersistedEntityInternal, D extends Document & I, M extends Model<D>>(databaseModel: M, conditions: Queryable<I>, populate?: Populatable<I>): Promise<I | undefined> {

		return new Promise((resolve, reject) => {

			this.find(databaseModel, conditions, undefined, populate)
				.then((results) => {

					if(results.length > 1) {

						reject(AppError.DATABASE_FIND.withDetails('findOne conditions matched more than one element'))
					}
					else if(results.length === 0) {

						resolve(undefined);
					}
					else {

						resolve(results[0]);
					}
				})
				.catch((error) => {

					reject(error);
				});
		});
	}

	/**
	 * Helper to first check uniqueness conditions and then, if no duplicates are found, save a document
	 * @param databaseModel the database model
	 * @param internalModel the internal model that works as the data source
	 * @param emptyDocument the empty document that will get all "internalModel" data and will then be saved to the DB
	 * @param uniquenessConditions if existing documents match these conditions, the new document won't be saved and an error will be thrown
	 */
	public checkUniquenessAndSave<I extends PersistedEntityInternal, D extends Document & I, M extends Model<D>>(databaseModel: M, internalModel: I, emptyDocument: D, uniquenessConditions: Queryable<I>): Promise<I> {

		return new Promise((resolve, reject) => {

			this.find(databaseModel, uniquenessConditions)
				.then((results) => {

					// Check results with same values (excluding the new model itself, this could be an update!)
					let duplicates = [];
					for(let result of results) {

						if(!internalModel._id || String(result._id) !== String(internalModel._id)) {

							duplicates.push(result);
						}
					}

					// If we have duplicates throw error, otherwise save document
					if(duplicates.length > 0) {

						logger.error('Uniqueness constraint error, cannot save. Dusplicates: %s', duplicates);
						reject(AppError.DATABASE_SAVE_UNIQUENESS.withDetails('Duplicates: ' + JSON.stringify(duplicates.map(elem => elem._id))));
					}
					else {

						this.save(internalModel, emptyDocument)
							.then((saveResult) => {

								resolve(saveResult);
							})
							.catch((error) => {

								logger.error('Database save error after uniqueness check: %s', error);
								reject(AppError.DATABASE_SAVE.unlessAppError(error));
							});
					}
				})
				.catch((error) => {

					logger.error('Database uniqueness check error: %s', error);
					reject(AppError.DATABASE_SAVE.unlessAppError(error));
				});
		});
	}

	/**
	 * Helper to insert a new or updated an existing model to the database
	 * @param internalModel the internal model that works as the data source
	 * @param emptyDocument the empty document that will get all "internalModel" data and will then be saved to the DB
	 * @returns the promise that will eventually return the newly saved element
	 */
	public save<I extends PersistedEntityInternal, D extends Document & I>(internalModel: I, emptyDocument: D): Promise<I> {

		return new Promise((resolve, reject) => {

			// Copy all properties from the internal model to the empty document
			const autogeneratedId =  emptyDocument._id;
			var document = Object.assign(emptyDocument, internalModel);

			// Check if insert or update
			if(document._id) {

				document.isNew = false;
			}
			else {

				document._id = autogeneratedId;
				document.isNew = true;
			}

			document.save((error: any, savedDocument: D) => {
			   
				if(error) {
					
					logger.error('Database save error: %s', error);
					reject(AppError.DATABASE_SAVE.unlessAppError(error));
				}
				else {

					if(savedDocument) {

						resolve(savedDocument);
					}
					else {

						logger.error('Cannot find document after save');
						reject(AppError.DATABASE_SAVE.withDetails('Cannot find document'));
					}
				}
			});
		});
	}

	/**
	 * Helper to delete a database element by ID
	 * @param databaseModel the database model
	 * @param id the element ID
	 * @returns a promise with the number of deleted elements
	 */
	public deleteById<I extends PersistedEntityInternal, D extends Document & I, M extends Model<D>>(databaseModel: M, id: string): Promise<number> {

		return new Promise((resolve, reject) => {

			databaseModel.findByIdAndRemove(id)
				.then((deletedDocument) => {

					if(deletedDocument) {

						resolve(1);
					}
					else {

						logger.error('Delete error, cannot find document');
						reject(AppError.DATABASE_DELETE.withDetails('Cannot find document'));
					}
				})
				.catch((error: any) => {

					logger.error('Database delete error: %s', error);
					reject(AppError.DATABASE_DELETE.unlessAppError(error));
				});
		});
	}

	/**
	 * Helper to delete a database elements with a query condition
	 * @param databaseModel the database model
	 * @param conditions query conditions
	 * @returns a promise with the number of deleted elements
	 */
	public delete<I extends PersistedEntityInternal, D extends Document & I, M extends Model<D>>(databaseModel: M, conditions: Queryable<I>): Promise<number> {

		return new Promise((resolve, reject) => {

			databaseModel.deleteMany(conditions)
				.then((deletedDocumentsCount) => {

					resolve(deletedDocumentsCount && deletedDocumentsCount.n ? deletedDocumentsCount.n : 0);
				})
				.catch((error: any) => {

					logger.error('Database delete error: %s', error);
					reject(AppError.DATABASE_DELETE.unlessAppError(error));
				});
		});
	}
}

/**
 * Singleton implementation of the query helper
 */
export const queryHelper = new QueryHelper();

/**
 * Helper type to make all properties in T be optionally asc or desc
 */
export type Sortable<T> = {
    [P in keyof T]?: SortDirection;
};

/**
 * Helper type to describe the sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Helper type to make all properties in T optional, possibily regular expressions and possibly with nested OR conditions
 */
export type Queryable<T> = {
    [P in keyof T]?: T[P] | RegExp;
} & {$or?: Queryable<T>[]};

/**
 * Helper type to make all properties in T be optionally true or false
 */
export type Populatable<T> = {
    [P in keyof T]?: boolean;
};
