import { Document, Model, model } from "mongoose";
import { CategoryInternal } from "../../models/internal/category";
import { CategorySchema, CATEGORY_COLLECTION_NAME } from "../../schemas/category";
import { Queryable, queryHelper } from "../database/query-helper";
import { mediaItemController } from "./media-item";

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
class CategoryController {

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

			return queryHelper.save(category, new CategoryModel());
		}
		else {

			const conditions: QueryConditions = {
				owner: category.owner,
				name: category.name
			};
			return queryHelper.checkUniquenessAndSave(CategoryModel, category, new CategoryModel(), conditions);
		}
	}

	/**
	 * Deletes a category with the given ID, returning a void promise
	 * @param id the category ID
	 */
	public deleteCategory(id: string): Promise<void> {

		// First delete all media items in the category
		return mediaItemController.deleteAllMediaItemsInCategory(id)
			.then(() => {

				// Then delete the category
				return queryHelper.deleteById(CategoryModel, id)
			});
	}

	/**
	 * Deletes all categories for the given user, returning the number of deleted elements as a promise
	 * @param userId user ID
	 */
	public deleteAllCategories(userId: string): Promise<number> {

		// First delete all user media items
		return mediaItemController.deleteAllMediaItemsForUser(userId)
			.then(() => {

				const conditions: QueryConditions = {
					owner: userId
				};

				// Then delete all categories
				return queryHelper.delete(CategoryModel, conditions);
			})
	}
}

/**
 * Singleton implementation of the category controller
 */
export const categoryController = new CategoryController();


