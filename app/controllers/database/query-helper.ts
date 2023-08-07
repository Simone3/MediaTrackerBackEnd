import { config } from 'app/config/config';
import { AppError } from 'app/data/models/error/error';
import { PersistedEntityInternal } from 'app/data/models/internal/common';
import { logger, performanceLogger } from 'app/loggers/logger';
import { Document, FilterQuery, Model, SortOrder, UpdateQuery } from 'mongoose';

/**
 * Collation search options (for case insensitive ordering)
 */
const COLLATION = {
	locale: 'en'
};

/**
 * Helper controller that contains util methods for database manipulation
 * @template TPersistedEntity the entity class
 * @template TDocument the MongoDB document class
 * @template TModel the MongoDB document class
 */
export class QueryHelper<TPersistedEntity extends PersistedEntityInternal, TDocument extends Document & TPersistedEntity, TModel extends Model<TDocument>> {

	private readonly databaseModel: TModel;

	/**
	 * Constructor
	 * @param databaseModel the database model
	 */
	public constructor(databaseModel: TModel) {
		
		this.databaseModel = databaseModel;
	}

	/**
	 * Helper to get from the database all elements of a model
	 * @param conditions optional query conditions
	 * @param sortBy optional sort conditions
	 * @param populate list of 'joined' columns to populate
	 * @returns a promise that will eventually contain the list of all internal model representations of the persisted elements
	 */
	public find(conditions?: FilterQuery<TDocument>, sortBy?: Sortable<PersistedEntityInternal>, populate?: Populatable<TPersistedEntity>): Promise<TPersistedEntity[]> {

		const startNs = process.hrtime.bigint();

		return new Promise((resolve, reject): void => {

			const query = this.databaseModel
				.find(conditions ? conditions : {})
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

					this.logPerformance('find', startNs);
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
	 * @returns a promise that will eventually contain the internal model representation of the persisted element, or undefined if not found
	 */
	public findOne(conditions: FilterQuery<TDocument>, populate?: Populatable<TPersistedEntity>): Promise<TPersistedEntity | undefined> {

		const startNs = process.hrtime.bigint();
		
		return new Promise((resolve, reject): void => {

			this.find(conditions, undefined, populate)
				.then((results) => {

					if(results.length > 1) {

						reject(AppError.DATABASE_FIND.withDetails('findOne conditions matched more than one element'));
					}
					else {
						
						this.logPerformance('findOne', startNs);

						if(results.length === 0) {

							resolve(undefined);
						}
						else {

							resolve(results[0]);
						}
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
	 * @returns the persisted entity, as a promise
	 */
	public checkUniquenessAndSave(internalModel: TPersistedEntity, emptyDocument: TDocument, uniquenessConditions: FilterQuery<TDocument>): Promise<TPersistedEntity> {

		const startNs = process.hrtime.bigint();
		
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

								this.logPerformance('checkUniquenessAndSave', startNs);
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
	public async save(internalModel: TPersistedEntity, emptyDocument: TDocument): Promise<TPersistedEntity> {

		const startNs = process.hrtime.bigint();
	
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

		const savedDocument = await document.save();
		if(document === savedDocument) {

			this.logPerformance('save', startNs);
			return savedDocument;
		}
		else {

			logger.error('Error saving document, documents do not match!');
			throw AppError.DATABASE_SAVE.withDetails('Error saving document, documents do not match!');
		}
	}

	/**
	 * Helper to selectively update one or more records with the given values
	 * @param set the new values (any other non-specified value will remain unchanged)
	 * @param conditions filter conditions
	 * @returns the number of updated records, as a promise
	 */
	public async updateSelectiveMany(set: UpdateQuery<TDocument>, conditions?: FilterQuery<TDocument>): Promise<number> {
		
		const startNs = process.hrtime.bigint();

		const result = await this.databaseModel.updateMany(conditions ? conditions : {}, set);
		if(result.acknowledged) {

			this.logPerformance('updateSelectiveMany', startNs);
			return result.modifiedCount;
		}
		else {

			logger.error('updateMany not acknowledged');
			throw AppError.DATABASE_SAVE.withDetails('updateMany not acknowledged');
		}
	}

	/**
	 * Helper to delete a database element by ID
	 * @param id the element ID
	 * @returns a promise with the number of deleted elements
	 */
	public deleteById(id: string): Promise<number> {

		const startNs = process.hrtime.bigint();
		
		return new Promise((resolve, reject): void => {
			
			this.databaseModel.findOneAndDelete({ _id: id } as FilterQuery<TDocument>)
				.then((deletedDocument) => {

					if(deletedDocument) {

						this.logPerformance('deleteById', startNs);
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
	public delete(conditions: FilterQuery<TDocument>): Promise<number> {

		const startNs = process.hrtime.bigint();
		
		return new Promise((resolve, reject): void => {

			this.databaseModel.deleteMany(conditions)
				.then((deletedDocumentsCount) => {

					this.logPerformance('delete', startNs);
					resolve(deletedDocumentsCount && deletedDocumentsCount.deletedCount ? deletedDocumentsCount.deletedCount : 0);
				})
				.catch((error) => {

					logger.error('Database delete error: %s', error);
					reject(AppError.DATABASE_DELETE.withDetails(error));
				});
		});
	}

	/**
	 * Helper to log the query performance
	 * @param queryMethod the method name
	 * @param startNs the invocation start
	 */
	private logPerformance(queryMethod: string, startNs: bigint): void {

		if(config.log.performance.active) {

			const endNs = process.hrtime.bigint();
			const elapsedTimeNs = endNs - startNs;
			const elapsedTimeMs = elapsedTimeNs / BigInt(1e6);
			
			performanceLogger.debug('Query %s on %s took %s ms [%s ns]', queryMethod, this.databaseModel.collection.name, elapsedTimeMs, elapsedTimeNs);
		}
	}
}

/**
 * Helper type to make all properties in T be optionally asc or desc
 */
export type Sortable<T> = {
	[P in keyof T]?: SortOrder;
};

/**
 * Helper type to make all properties in T be optionally true or false
 */
export type Populatable<T> = {
	[P in keyof T]?: boolean;
};
