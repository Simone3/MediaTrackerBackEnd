import { IsNotEmpty, IsString, ValidateNested, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';
import { CommonResponse, CommonSaveRequest } from './common';

/**
 * Model for a category, publicly exposed via API
 */
export class Category {

	/**
	 * The category name
	 */
	@IsNotEmpty()
	@IsString()
	name!: string;
};

/**
 * Model for a category with an ID property, publicly exposed via API
 */
export class IdentifiedCategory extends Category {

	/**
	 * The category unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};

/**
 * Request for the "add category" API
 */
export class AddCategoryRequest extends CommonSaveRequest {

	/**
	 * The category to add
	 */
	@IsDefined()
	@Type(() => Category)
	@ValidateNested()
	newCategory!: Category;
};

/**
 * Response for the "add category" API
 */
export class AddCategoryResponse extends CommonResponse {

}

/**
 * Response for the "delete category" API
 */
export class DeleteCategoryResponse extends CommonResponse {

}

/**
 * Response for the "get all categories" API
 */
export class GetAllCategoriesResponse extends CommonResponse {

	categories: IdentifiedCategory[] = [];
};

/**
 * Request for the "update category" API
 */
export class UpdateCategoryRequest extends CommonSaveRequest {

	/**
	 * The category to update
	 */
	@IsDefined()
	@Type(() => Category)
	@ValidateNested()
	category!: Category;
};

/**
 * Response for the "update category" API
 */
export class UpdateCategoryResponse extends CommonResponse {

}