import { ModelMapper } from 'app/mappers/common';
import { IdentifiedCategory, MediaType } from 'app/models/api/category';
import { AppError } from 'app/models/error/error';
import { CategoryInternal, MediaTypeInternal } from 'app/models/internal/category';

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
			mediaType: this.toExternalMediaType(source.mediaType)
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
			mediaType: this.toInternalMediaType(source.mediaType)
		};
	}

	/**
	 * Helper to translate the media type enumeration
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
 * Singleton instance of the categories mapper
 */
export const categoryMapper = new CategoryMapper();

