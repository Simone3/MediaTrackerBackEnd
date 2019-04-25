import { logger } from 'app/loggers/logger';
import { AppError } from 'app/models/error/error';
import { PersistedEntityInternal } from 'app/models/internal/common';
import { CollationOptions, Document, Model } from 'mongoose';

/**
 * Collation search options (for case insensitive ordering)
 */
const COLLATION: CollationOptions = {
	locale: 'en'
};

/**
 * Helper controller that contains util methods for database manipulation
 */
export class QueryHelper<TPersistedEntity extends PersistedEntityInternal, TDocument extends Document & TPersistedEntity, TModel extends Model<TDocument>> {

	/**
	 * Constructor
	 * @param databaseModel the database model
	 */
	public constructor(private databaseModel: TModel) {

		// Just for parameter property
	}

	/**
	 * Helper to get from the database all elements of a model
	 * @param conditions optional query conditions
	 * @param sortBy optional sort conditions
	 * @param populate list of 'joined' columns to populate
	 * @return a promise that will eventually contain the list of all internal model representations of the persisted elements
	 */
	public find(conditions?: Queryable<TPersistedEntity>, sortBy?: Sortable<TPersistedEntity>, populate?: Populatable<TPersistedEntity>): Promise<TPersistedEntity[]> {

		return new Promise((resolve, reject): void => {

			const query = this.databaseModel
				.find(conditions)
				.collation(COLLATION)
				.sort(sortBy);

			if(populate) {

				for(const populateField in populate) {

					if(populate[populateField]) {
						
						query.populate(populateField);
					}
				}
			}

			query
				.then((documents: TDocument[]) => {

					resolve(documents);
				})
				.catch((error) => {

					logger.error('Database find error: %s', error);
					reject(AppError.DATABASE_FIND.withDetails(error));
				});
		});
	}

	/**
	 * Helper to get from the database a single element of a model. If more than one element matches the conditions, an error is thrown.
	 * @param conditions optional query conditions
	 * @param populate list of 'joined' columns to populate
	 * @return a promise that will eventually contain the internal model representation of the persisted element, or undefined if not found
	 */
	public findOne(conditions: Queryable<TPersistedEntity>, populate?: Populatable<TPersistedEntity>): Promise<TPersistedEntity | undefined> {

		return new Promise((resolve, reject): void => {

			this.find(conditions, undefined, populate)
				.then((results) => {

					if(results.length > 1) {

						reject(AppError.DATABASE_FIND.withDetails('findOne conditions matched more than one element'));
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
	 * @param internalModel the internal model that works as the data source
	 * @param emptyDocument the empty document that will get all 'internalModel' data and will then be saved to the DB
	 * @param uniquenessConditions if existing documents match these conditions, the new document won't be saved and an error will be thrown
	 */
	public checkUniquenessAndSave(internalModel: TPersistedEntity, emptyDocument: TDocument, uniquenessConditions: Queryable<TPersistedEntity>): Promise<TPersistedEntity> {

		return new Promise((resolve, reject): void => {

			this.find(uniquenessConditions)
				.then((results) => {

					// Check results with same values (excluding the new model itself, this could be an update!)
					const duplicates = [];
					for(const result of results) {

						if(!internalModel._id || String(result._id) !== String(internalModel._id)) {

							duplicates.push(result);
						}
					}

					// If we have duplicates throw error, otherwise save document
					if(duplicates.length > 0) {

						logger.error('Uniqueness constraint error, cannot save. Dusplicates: %s', duplicates);
						reject(AppError.DATABASE_SAVE_UNIQUENESS.withDetails(`Duplicates: ${JSON.stringify(duplicates.map((elem) => {
							return elem._id;
						}))}`));
					}
					else {

						this.save(internalModel, emptyDocument)
							.then((saveResult) => {

								resolve(saveResult);
							})
							.catch((error) => {

								logger.error('Database save error after uniqueness check: %s', error);
								reject(AppError.DATABASE_SAVE.withDetails(error));
							});
					}
				})
				.catch((error) => {

					logger.error('Database uniqueness check error: %s', error);
					reject(AppError.DATABASE_SAVE.withDetails(error));
				});
		});
	}

	/**
	 * Helper to insert a new or updated an existing model to the database
	 * @param internalModel the internal model that works as the data source
	 * @param emptyDocument the empty document that will get all 'internalModel' data and will then be saved to the DB
	 * @returns the promise that will eventually return the newly saved element
	 */
	public save(internalModel: TPersistedEntity, emptyDocument: TDocument): Promise<TPersistedEntity> {

		return new Promise((resolve, reject): void => {

			// Manage IDs (save original autogenerated for inserts and make sure internalModel ID's is 'null' and not 'undefined' for Object.assign)
			const autogeneratedId = emptyDocument._id;
			if(!internalModel._id) {
				internalModel._id = null;
			}

			// Copy all properties from the internal model to the empty document
			const document = Object.assign(emptyDocument, internalModel);

			// Check if insert or update
			if(document._id) {

				document.isNew = false;
			}
			else {

				document._id = autogeneratedId;
				document.isNew = true;
			}

			document.save((error, savedDocument) => {
 
				if(error) {
					
					logger.error('Database save error: %s', error);
					reject(AppError.DATABASE_SAVE.withDetails(error));
				}
				else if(savedDocument) {

					resolve(savedDocument);
				}
				else {

					logger.error('Cannot find document after save');
					reject(AppError.DATABASE_SAVE.withDetails('Cannot find document'));
				}
			});
		});
	}

	/**
	 * Helper to delete a database element by ID
	 * @param id the element ID
	 * @returns a promise with the number of deleted elements
	 */
	public deleteById(id: string): Promise<number> {

		return new Promise((resolve, reject): void => {

			this.databaseModel.findByIdAndRemove(id)
				.then((deletedDocument) => {

					if(deletedDocument) {

						resolve(1);
					}
					else {

						logger.error('Delete error, cannot find document');
						reject(AppError.DATABASE_DELETE.withDetails('Cannot find document'));
					}
				})
				.catch((error) => {

					logger.error('Database delete error: %s', error);
					reject(AppError.DATABASE_DELETE.withDetails(error));
				});
		});
	}

	/**
	 * Helper to delete a database elements with a query condition
	 * @param conditions query conditions
	 * @returns a promise with the number of deleted elements
	 */
	public delete(conditions: Queryable<TPersistedEntity>): Promise<number> {

		return new Promise((resolve, reject): void => {

			this.databaseModel.deleteMany(conditions)
				.then((deletedDocumentsCount) => {

					resolve(deletedDocumentsCount && deletedDocumentsCount.n ? deletedDocumentsCount.n : 0);
				})
				.catch((error) => {

					logger.error('Database delete error: %s', error);
					reject(AppError.DATABASE_DELETE.withDetails(error));
				});
		});
	}
}

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
