import { Document, Model, model } from "mongoose";
import { CategoryInternal } from "../models/internal/category";
import { CategorySchema, CATEGORY_COLLECTION_NAME } from "../schemas/category";
import { AbstractModelController } from "./helper";
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
 * Controller for categories, wraps the persistence logic
 */
class CategoryController extends AbstractModelController {

	/**
	 * Gets all saved categories for the given user, as a promise
	 * @param userId user ID
	 */
	public getAllCategories(userId: string): Promise<CategoryInternal[]> {

		return this.findHelper(CategoryModel, {owner: userId});
	}

	/**
	 * Saves a new or an existing category, returning it back as a promise
	 * @param category the category to insert or update
	 */
	public saveCategory(category: CategoryInternal): Promise<CategoryInternal> {

		return this.saveHelper(category, new CategoryModel(), 'Category not found');
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
				return this.deleteByIdHelper(CategoryModel, id, 'Category not found')
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

				// Then delete all categories
				return this.deleteHelper(CategoryModel, {
					owner: userId
				});
			})
	}
}

/**
 * Singleton implementation of the category controller
 */
export const categoryController = new CategoryController();


