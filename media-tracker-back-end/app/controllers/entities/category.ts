import { Document, Model, model } from "mongoose";
import { CategoryInternal } from "../../models/internal/category";
import { CategorySchema, CATEGORY_COLLECTION_NAME } from "../../schemas/category";
import { Queryable, queryHelper, Sortable } from "../database/query-helper";
import { logger } from "../../loggers/logger";
import { AbstractEntityController } from "./helper";
import { groupController } from "./group";
import { userController } from "./user";
import { UserInternal } from "../../models/internal/user";
import { AppError } from "../../models/error/error";
import { mediaItemFactory } from "../../factories/media-item";
import { MediaItemInternal } from "../../models/internal/media-items/media-item";

/**
 * Mongoose document for categories
 */
interface CategoryDocument extends CategoryInternal, Document {}

/**
 * Mongoose model for categories
 */
const CategoryModel: Model<CategoryDocument> = model<CategoryDocument>(CATEGORY_COLLECTION_NAME, CategorySchema);

/**
 * Helper type for category query conditions
 */
type QueryConditions = Queryable<CategoryInternal>;

/**
 * Helper type for category sorting conditions
 */
type OrderBy = Sortable<CategoryInternal>;

/**
 * Controller for category entities
 */
class CategoryController extends AbstractEntityController {

	/**
	 * Gets a single category, or undefined if not found
	 * @param userId user ID
	 * @param categoryId category ID
	 */
	public getCategory(userId: string, categoryId: string): Promise<CategoryInternal | undefined> {

		const conditions: QueryConditions = {
			_id: categoryId,
			owner: userId
		};

		return queryHelper.findOne(CategoryModel, conditions);
	}

	/**
	 * Gets all saved categories for the given user, as a promise
	 * @param userId user ID
	 */
	public getAllCategories(userId: string): Promise<CategoryInternal[]> {

		const conditions: QueryConditions = {
			owner: userId
		};

		const sortBy: OrderBy = {
			name: "asc"
		};

		return queryHelper.find(CategoryModel, conditions, sortBy);
	}

	/**
	 * Saves a new or an existing category, returning it back as a promise
	 * @param category the category to insert or update
	 * @param allowSameName whether to check or not if an existing category has the same name
	 */
	public async saveCategory(category: CategoryInternal, allowSameName?: boolean): Promise<CategoryInternal> {
		
		await this.checkWritePreconditions(
			AppError.DATABASE_SAVE.withDetails(category._id ? 'Category does not exists for given user' : 'User does not exist'),
			category.owner,
			category._id,
			category);

		if(allowSameName) {

			logger.debug('Same name is allowed');
			return queryHelper.save(category, new CategoryModel());
		}
		else {

			logger.debug('Same name is NOT allowed');
			const conditions: QueryConditions = {
				owner: category.owner,
				name: category.name
			};
			return queryHelper.checkUniquenessAndSave(CategoryModel, category, new CategoryModel(), conditions);
		}
	}

	/**
	 * Deletes a category with the given ID, returning a promise with the number of deleted elements
	 * @param id the category ID
	 * @param forceEvenIfNotEmpty forces delete even if not empty (deletes all media items and groups inside it)
	 */
	public async deleteCategory(userId: string, categoryId: string, forceEvenIfNotEmpty: boolean): Promise<number> {

		await this.checkWritePreconditions(AppError.DATABASE_DELETE.withDetails('Category does not exist for given user'), userId, categoryId);

		const mediaItemController = await mediaItemFactory.getEntityControllerFromCategoryId(userId, categoryId);

		return this.cleanupWithEmptyCheck(forceEvenIfNotEmpty, () => {
			return mediaItemController.getAllMediaItemsInCategory(categoryId)
		}, () => {
			return Promise.all([
				groupController.deleteAllGroupsInCategory(categoryId),
				mediaItemController.deleteAllMediaItemsInCategory(categoryId),
				queryHelper.deleteById(CategoryModel, categoryId)
			])
		});
	}

	/**
	 * Deletes all categories for the given user, returning the number of deleted elements as a promise
	 * This method does NOT cascade delete all media items/groups in the categories
	 * @param userId user ID
	 */
	public deleteAllCategoriesForUser(userId: string): Promise<number> {

		const conditions: QueryConditions = {
			owner: userId
		};

		return queryHelper.delete(CategoryModel, conditions);
	}

	/**
	 * Helper to check preconditions on a insert/update/delete method
	 * @param errorToThow error to throw if the preconditions fail
	 * @param user the user
	 * @param categoryId the category ID (optional to use this method for new inserts)
	 */
	private async checkWritePreconditions(errorToThow: AppError, user: string | UserInternal, categoryId?: string, newCategoryData?: CategoryInternal): Promise<void> {

		const userId = typeof(user) === 'string' ? user : user._id;

		// Preconditions are different when it's a new category or an existing one
		if(categoryId) {

			// First check that the category exists
			const categoryCheckPromise = this.getCategory(userId, categoryId);
			await this.checkExistencePreconditionsHelper(errorToThow, () => categoryCheckPromise);

			// Then, if the media type changes, check that the category is empty
			const category = await categoryCheckPromise;
			if(category && newCategoryData && category.mediaType !== newCategoryData.mediaType) {

				const mediaItemController = await mediaItemFactory.getEntityControllerFromCategoryId(userId, categoryId);
				const mediaItems: MediaItemInternal[] = await mediaItemController.getAllMediaItemsInCategory(categoryId);
				if(mediaItems.length > 0) {

					throw AppError.DATABASE_SAVE.withDetails('Cannot change category media type if it contains media items');
				}
			}
			return;
		}
		else {

			// Make sure the user exists
			await this.checkExistencePreconditionsHelper(errorToThow, () => userController.getUser(userId));
			return;
		}
	}
}

/**
 * Singleton implementation of the category controller
 */
export const categoryController = new CategoryController();


