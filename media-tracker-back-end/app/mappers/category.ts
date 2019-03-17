import { CategoryInternal } from '../models/internal/category';
import { IdentifiedCategory, Category } from '../models/api/category';

/**
 * Helper class to translate between internal and public category models
 */
class CategoryMapper {

	/**
	 * List of internal models to list of public models
	 */
	public internalToApiList(sources: CategoryInternal[]): IdentifiedCategory[] {

		return sources.map((source) => {

			return this.internalToApi(source);
		});
	}

	/**
	 * Internal model to public model
	 */
	public internalToApi(source: CategoryInternal): IdentifiedCategory {
		
		return {
			uid: source._id,
			name: source.name
		};
	}

	/**
	 * List of public models to list of internal models
	 */
	public apiToInternalList<T extends (IdentifiedCategory | Category)>(sources: T[], userId: string): CategoryInternal[] {

		return sources.map((source) => {

			return this.apiToInternal(source, userId);
		});
	}

	/**
	 * Public model to internal model
	 */
	public apiToInternal<T extends (IdentifiedCategory | Category)>(source: T, userId: string): CategoryInternal {

		const isNew = (source instanceof Category);
		const id = (isNew ? null : (<IdentifiedCategory>source).uid);

		return {
			_id: id,
			name: source.name,
			owner: userId
		};
	}
}

/**
 * Singleton instance of the categories mapper
 */
export const categoryMapper = new CategoryMapper();


