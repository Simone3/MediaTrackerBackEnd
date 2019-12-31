import { ModelMapper } from 'app/data/mappers/common';
import { CategoryFilter, IdentifiedCategory, MediaType } from 'app/data/models/api/category';
import { AppError } from 'app/data/models/error/error';
import { CategoryFilterInternal, CategoryInternal, MediaTypeInternal } from 'app/data/models/internal/category';

/**
 * Helper type
 */
type CategoryMapperParams = {
	userId: string;
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
			name: source.name,
			mediaType: this.toExternalMediaType(source.mediaType),
			color: source.color
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedCategory, extraParams?: CategoryMapperParams): CategoryInternal {
		
		if(!extraParams) {
			throw AppError.GENERIC.withDetails('convertToInternal.extraParams cannot be undefined');
		}

		return {
			_id: source.uid ? source.uid : null,
			name: source.name,
			owner: extraParams.userId,
			mediaType: this.toInternalMediaType(source.mediaType),
			color: source.color
		};
	}

	/**
	 * Helper to translate the media type enumeration
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	private toExternalMediaType(source: MediaTypeInternal): MediaType {

		switch(source) {

			case 'BOOK': return 'BOOK';
			case 'MOVIE': return 'MOVIE';
			case 'TV_SHOW': return 'TV_SHOW';
			case 'VIDEOGAME': return 'VIDEOGAME';
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}

	/**
	 * Helper to translate the media type enumeration
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	private toInternalMediaType(source: MediaType): MediaTypeInternal {

		switch(source) {

			case 'BOOK': return 'BOOK';
			case 'MOVIE': return 'MOVIE';
			case 'TV_SHOW': return 'TV_SHOW';
			case 'VIDEOGAME': return 'VIDEOGAME';
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}
}

/**
 * Mapper for category filters
 */
class CategoryFilterMapper extends ModelMapper<CategoryFilterInternal, CategoryFilter, never> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: CategoryFilterInternal): CategoryFilter {
		
		return {
			name: source.name
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: CategoryFilter): CategoryFilterInternal {
		
		return {
			name: source.name
		};
	}
}

/**
 * Singleton instance of the categories mapper
 */
export const categoryMapper = new CategoryMapper();

/**
 * Singleton instance of the category filter mapper
 */
export const categoryFilterMapper = new CategoryFilterMapper();

