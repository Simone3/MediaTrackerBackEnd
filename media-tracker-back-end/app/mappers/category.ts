import { CategoryInternal, MediaTypeInternal } from '../models/internal/category';
import { IdentifiedCategory, MediaType } from '../models/api/category';
import { ModelMapper } from './common';
import { AppError } from 'app/models/error/error';

/**
 * Helper type
 */
type CategoryMapperParams = {
	userId: string
};

/**
 * Mapper for categories
 */
class CategoryMapper extends ModelMapper<CategoryInternal, IdentifiedCategory, CategoryMapperParams> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: CategoryInternal): IdentifiedCategory {
		
		return {
			uid: source._id,
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedCategory, extraParams?: CategoryMapperParams): CategoryInternal {
		
		if(!extraParams) {
			throw "convertToInternal.extraParams cannot be undefined"
		}

		return {
			_id: (source.uid ? source.uid : null),
			name: source.name,
			owner: extraParams.userId
		};
	}
}

/**
 * Singleton instance of the categories mapper
 */
export const categoryMapper = new CategoryMapper();


