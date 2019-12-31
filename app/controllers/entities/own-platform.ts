import { Queryable, QueryHelper, Sortable } from 'app/controllers/database/query-helper';
import { categoryController } from 'app/controllers/entities/category';
import { AbstractEntityController } from 'app/controllers/entities/helper';
import { AppError } from 'app/data/models/error/error';
import { CategoryInternal } from 'app/data/models/internal/category';
import { OwnPlatformFilterInternal, OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { mediaItemFactory } from 'app/factories/media-item';
import { OwnPlatformSchema, OWN_PLATFORM_COLLECTION_NAME } from 'app/schemas/own-platform';
import { miscUtils } from 'app/utilities/misc-utils';
import { Document, Model, model } from 'mongoose';

/**
 * Mongoose document for own platforms
 */
interface OwnPlatformDocument extends OwnPlatformInternal, Document {}

/**
 * Mongoose model for own platforms
 */
const OwnPlatformModel: Model<OwnPlatformDocument> = model<OwnPlatformDocument>(OWN_PLATFORM_COLLECTION_NAME, OwnPlatformSchema);

/**
 * Helper type for own platform query conditions
 */
type QueryConditions = Queryable<OwnPlatformInternal>;

/**
 * Helper type for own platform sorting conditions
 */
type OrderBy = Sortable<OwnPlatformInternal>;

/**
 * Controller for own platform entities
 */
class OwnPlatformController extends AbstractEntityController {

	private readonly queryHelper: QueryHelper<OwnPlatformInternal, OwnPlatformDocument, Model<OwnPlatformDocument>>;

	/**
	 * Constructor
	 */
	public constructor() {

		super();
		this.queryHelper = new QueryHelper(OwnPlatformModel);
	}

	/**
	 * Gets a single own platform
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param ownPlatformId gorup ID
	 * @returns the own platform or undefined if not found, as a promise
	 */
	public getOwnPlatform(userId: string, categoryId: string, ownPlatformId: string): Promise<OwnPlatformInternal | undefined> {

		const conditions: QueryConditions = {
			_id: ownPlatformId,
			owner: userId,
			category: categoryId
		};

		return this.queryHelper.findOne(conditions);
	}
	
	/**
	 * Gets all saved own platforms for the given user and category
	 * @param userId user ID
	 * @param categoryId category ID
	 * @returns the own platforms, as a promise
	 */
	public getAllOwnPlatforms(userId: string, categoryId: string): Promise<OwnPlatformInternal[]> {

		return this.filterOwnPlatforms(userId, categoryId);
	}

	/**
	 * Gets all own platforms matching the given filter for the given user and category
	 * @param userId user ID
	 * @param categoryId category ID
	 * @param filter the filter
	 * @returns the own platforms, as a promise
	 */
	public filterOwnPlatforms(userId: string, categoryId: string, filter?: OwnPlatformFilterInternal): Promise<OwnPlatformInternal[]> {

		const conditions: QueryConditions = {
			owner: userId,
			category: categoryId
		};

		if(filter && filter.name) {
			
			// Case insensitive exact match
			conditions.name = new RegExp(`^${filter.name}$`, 'i');
		}

		const sortBy: OrderBy = {
			name: 'asc'
		};

		return this.queryHelper.find(conditions, sortBy);
	}

	/**
	 * Saves a new or an existing own platform, returning it back as a promise
	 * @param ownPlatform the own platform to insert or update
	 * @param skipCheckPreconditions if true, skips existance preconditions
	 * @returns the saved own platform, as a promise
	 */
	public async saveOwnPlatform(ownPlatform: OwnPlatformInternal, skipCheckPreconditions?: boolean): Promise<OwnPlatformInternal> {

		if(!skipCheckPreconditions) {
			
			await this.checkWritePreconditions(
				AppError.DATABASE_SAVE.withDetails(ownPlatform._id ? 'Own platform does not exists for given user/category' : 'User or category does not exist'),
				ownPlatform.owner,
				ownPlatform.category,
				ownPlatform._id
			);
		}

		return this.queryHelper.save(ownPlatform, new OwnPlatformModel());
	}

	/**
	 * Merges two or more own platforms into one, also replacing their references in media items
	 * @param ownPlatformIds the platform IDs (>= 2)
	 * @param mergedData the final merged platform data
	 * @returns the number of merged platforms, as a promise
	 */
	public async mergeOwnPlatforms(ownPlatformIds: string[], mergedData: OwnPlatformInternal): Promise<number> {

		if(ownPlatformIds.length < 2) {

			throw AppError.GENERIC.withDetails('Invalid mergeOwnPlatforms input');
		}

		// Check that all platforms belong to the given user and category
		const userId = this.getEntityStringId(mergedData.owner);
		const categoryId = this.getEntityStringId(mergedData.category);
		const checkPlatforms = await this.queryHelper.find({
			owner: userId,
			category: categoryId,
			_id: { $in: ownPlatformIds }
		});
		if(checkPlatforms.length !== ownPlatformIds.length) {

			throw AppError.DATABASE_SAVE.withDetails('One or more platforms not found for given user/category');
		}

		// Define the platform to keep and the platforms to delete
		const finalOwnPlatform: OwnPlatformInternal = {
			...mergedData,
			_id: ownPlatformIds[0]
		};
		const platformsToDelete = ownPlatformIds.slice(1, ownPlatformIds.length);

		// Save the new platform data
		await this.saveOwnPlatform(finalOwnPlatform);

		// Replace platforms in all media items
		const mediaItemController = await mediaItemFactory.getEntityControllerFromCategoryId(userId, categoryId);
		await mediaItemController.replaceOwnPlatformInAllMediaItems(userId, categoryId, platformsToDelete, finalOwnPlatform._id);

		// Delete all other platforms
		return miscUtils.mergeAndSumPromiseResults(platformsToDelete.map((id) => {

			return this.queryHelper.deleteById(id);
		}));
	}

	/**
	 * Deletes a own platform with the given ID
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @param ownPlatformId the own platform ID
	 * @returns a promise with the number of deleted elements
	 */
	public async deleteOwnPlatform(userId: string, categoryId: string, ownPlatformId: string): Promise<number> {
		
		await this.checkWritePreconditions(AppError.DATABASE_DELETE.withDetails('OwnPlatform does not exist for given user/category'), userId, categoryId, ownPlatformId);
		
		const mediaItemController = await mediaItemFactory.getEntityControllerFromCategoryId(userId, categoryId);

		return miscUtils.mergeAndSumPromiseResults([
			this.queryHelper.deleteById(ownPlatformId),
			mediaItemController.replaceOwnPlatformInAllMediaItems(userId, categoryId, ownPlatformId, undefined)
		]);
	}

	/**
	 * Deletes all own platforms for the given category
	 * This method does NOT cascade delete all media items in the own platforms
	 * @param categoryId category ID
	 * @returns the number of deleted elements as a promise
	 */
	public deleteAllOwnPlatformsInCategory(categoryId: string): Promise<number> {

		const conditions: QueryConditions = {
			category: categoryId
		};

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Deletes all own platforms for the given user
	 * This method does NOT cascade delete all media items in the own platforms
	 * @param userId user ID
	 * @returns the number of deleted elements as a promise
	 */
	public deleteAllOwnPlatformsForUser(userId: string): Promise<number> {

		const conditions: QueryConditions = {
			owner: userId
		};

		return this.queryHelper.delete(conditions);
	}

	/**
	 * Helper to check preconditions on a insert/update/delete method
	 * @param errorToThow error to throw if the preconditions fail
	 * @param userId the user
	 * @param category the category
	 * @param ownPlatformId the own platform ID (optional to use this method for new inserts)
	 * @returns a promise that resolves if all preconditions are OK
	 */
	private checkWritePreconditions(errorToThow: AppError, userId: string, category: string | CategoryInternal, ownPlatformId?: string): Promise<void> {

		return this.checkExistencePreconditionsHelper(errorToThow, () => {

			const categoryId = typeof category === 'string' ? category : category._id;

			if(ownPlatformId) {

				// Make sure the platform exists
				return this.getOwnPlatform(userId, categoryId, ownPlatformId);
			}
			else {

				// Make sure the category exists
				return categoryController.getCategory(userId, categoryId);
			}
		});
	}
}

/**
 * Singleton implementation of the own platform controller
 */
export const ownPlatformController = new OwnPlatformController();

