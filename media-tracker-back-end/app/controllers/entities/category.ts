import { Document, Model, model } from "mongoose";
import { CategoryInternal } from "../../models/internal/category";
import { CategorySchema, CATEGORY_COLLECTION_NAME } from "../../schemas/category";
import { Queryable, queryHelper } from "../database/query-helper";
import { mediaItemController } from "./media-item";
import { logger } from "../../loggers/logger";
import { AbstractEntityController } from "./helper";
import { groupController } from "./group";

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
 * Controller for category entities
 */
class CategoryController extends AbstractEntityController {

	/**
	 * Gets all saved categories for the given user, as a promise
	 * @param userId user ID
	 */
	public getAllCategories(userId: string): Promise<CategoryInternal[]> {

		const conditions: QueryConditions = {
			owner: userId
		};

		return queryHelper.find(CategoryModel, conditions);
	}

	/**
	 * Saves a new or an existing category, returning it back as a promise
	 * @param category the category to insert or update
	 * @param allowSameName whether to check or not if an existing category has the same name
	 */
	public saveCategory(category: CategoryInternal, allowSameName?: boolean): Promise<CategoryInternal> {

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
	public deleteCategory(id: string, forceEvenIfNotEmpty: boolean): Promise<number> {

		return this.cleanupWithEmptyCheck(forceEvenIfNotEmpty, () => {
			return mediaItemController.getAllMediaItemsInCategory(id)
		}, () => {
			return Promise.all([
				groupController.deleteAllGroupsInCategory(id),
				mediaItemController.deleteAllMediaItemsInCategory(id),
				queryHelper.deleteById(CategoryModel, id)
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
}

/**
 * Singleton implementation of the category controller
 */
export const categoryController = new CategoryController();


