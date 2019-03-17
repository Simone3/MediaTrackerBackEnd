import { Document, Model, model} from "mongoose";
import { CategoryInternal } from "../models/internal/category";
import { CategorySchema, CATEGORY_COLLECTION_NAME } from "../schemas/category";
import { AbstractModelController } from "./helper";

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

		return this.deleteHelper(CategoryModel, id, 'Category not found');
	}
}

/**
 * Singleton implementation of the category controller
 */
export const categoryController = new CategoryController();


