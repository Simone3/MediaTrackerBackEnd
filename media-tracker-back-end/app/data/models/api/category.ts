import { CommonAddResponse, CommonRequest, CommonResponse, CommonSaveRequest } from 'app/data/models/api/common';
import { ValuesOf } from 'app/utilities/helper-types';
import { Type } from 'class-transformer';
import { IsDefined, IsHexColor, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Array of all media types, publicly exposed via API
 */
export const MEDIA_TYPES: [ 'BOOK', 'MOVIE', 'TV_SHOW', 'VIDEOGAME' ] = [ 'BOOK', 'MOVIE', 'TV_SHOW', 'VIDEOGAME' ];

/**
 * A category media type, publicly exposed via API
 */
export type MediaType = ValuesOf<typeof MEDIA_TYPES>;

/**
 * Model for a category, publicly exposed via API
 */
export class Category {

	/**
	 * The category name
	 */
	@IsNotEmpty()
	@IsString()
	public name!: string;

	/**
	 * The category media type
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(MEDIA_TYPES)
	public mediaType!: MediaType

	/**
	 * The category color
	 */
	@IsNotEmpty()
	@IsHexColor()
	public color!: string;
}

/**
 * Model for a category with an ID property, publicly exposed via API
 */
export class IdentifiedCategory extends Category {

	/**
	 * The category unique ID
	 */
	@IsNotEmpty()
	@IsString()
	public uid!: string;
}

/**
 * Request for the 'add category' API
 */
export class AddCategoryRequest extends CommonSaveRequest {

	/**
	 * The category to add
	 */
	@IsDefined()
	@Type(() => {
		return Category;
	})
	@ValidateNested()
	public newCategory!: Category;
}

/**
 * Response for the 'add category' API
 */
export class AddCategoryResponse extends CommonAddResponse {

}

/**
 * Response for the 'delete category' API
 */
export class DeleteCategoryResponse extends CommonResponse {

}

/**
 * Response for the 'get all categories' API
 */
export class GetAllCategoriesResponse extends CommonResponse {
	
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return IdentifiedCategory;
	})
	@ValidateNested()
	public categories: IdentifiedCategory[] = [];
}

/**
 * Category filtering options, publicly exposed via API
 */
export class CategoryFilter {

	/**
	 * Filter for name (case-insensitive exact match)
	 */
	@IsOptional()
	@IsString()
	public name?: string;
}

/**
 * Request for the 'filter categories' API
 */
export class FilterCategoriesRequest extends CommonRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => {
		return CategoryFilter;
	})
	@ValidateNested()
	public filter?: CategoryFilter;
}

/**
 * Response for the 'filter movies' API
 */
export class FilterCategoriesResponse extends CommonResponse {

	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return IdentifiedCategory;
	})
	@ValidateNested()
	public categories: IdentifiedCategory[] = [];
}

/**
 * Request for the 'update category' API
 */
export class UpdateCategoryRequest extends CommonSaveRequest {

	/**
	 * The category to update
	 */
	@IsDefined()
	@Type(() => {
		return Category;
	})
	@ValidateNested()
	public category!: Category;
}

/**
 * Response for the 'update category' API
 */
export class UpdateCategoryResponse extends CommonResponse {

}
