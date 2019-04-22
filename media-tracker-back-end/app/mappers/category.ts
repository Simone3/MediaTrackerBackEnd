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
			name: source.name,
			mediaType: this.toExternalMediaType(source.mediaType)
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
			owner: extraParams.userId,
			mediaType: this.toInternalMediaType(source.mediaType)
		};
	}

	/**
	 * Helper to translate the media type enumeration
	 */
	private toExternalMediaType(source: MediaTypeInternal): MediaType {

		switch(source) {

			case MediaTypeInternal.BOOK: return MediaType.BOOK;
			case MediaTypeInternal.MOVIE: return MediaType.MOVIE;
			case MediaTypeInternal.TV_SHOW: return MediaType.TV_SHOW;
			case MediaTypeInternal.VIDEOGAME: return MediaType.VIDEOGAME;
			default: throw AppError.GENERIC.withDetails('Cannot map ' + source);
		}
	}

	/**
	 * Helper to translate the media type enumeration
	 */
	private toInternalMediaType(source: MediaType): MediaTypeInternal {

		switch(source) {

			case MediaType.BOOK: return MediaTypeInternal.BOOK;
			case MediaType.MOVIE: return MediaTypeInternal.MOVIE;
			case MediaType.TV_SHOW: return MediaTypeInternal.TV_SHOW;
			case MediaType.VIDEOGAME: return MediaTypeInternal.VIDEOGAME;
			default: throw AppError.GENERIC.withDetails('Cannot map ' + source);
		}
	}
}

/**
 * Singleton instance of the categories mapper
 */
export const categoryMapper = new CategoryMapper();


