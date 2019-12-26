import { ModelMapper } from 'app/data/mappers/common';
import { OldAppCategory, OldAppColor, OldAppMediaType } from 'app/data/models/api/import/old-app/category';
import { OldAppMediaItem } from 'app/data/models/api/import/old-app/media-item';
import { AppError } from 'app/data/models/error/error';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { OldAppCategoryInternal } from 'app/data/models/internal/import/old-app/category';
import { OldAppMediaItemInternal } from 'app/data/models/internal/import/old-app/media-item';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { oldAppBookMapper } from './media-items/book';
import { oldAppMovieMapper } from './media-items/movie';
import { oldAppTvShowMapper } from './media-items/tv-show';
import { oldAppVideogameMapper } from './media-items/videogame';

/**
 * Mapper from the old Media Tracker app export category to the new internal model
 */
class OldAppCategoryMapper extends ModelMapper<OldAppCategoryInternal, OldAppCategory, never> {
		
	/**
	 * @override
	 */
	protected convertToExternal(): OldAppCategory {
		
		throw AppError.GENERIC.withDetails('Not required');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: OldAppCategory): OldAppCategoryInternal {
		
		const mediaType = this.mapToInternalMediaType(source.MEDIA_TYPE_NAME);
		
		return {
			categoryData: {
				_id: '',
				name: source.NAME,
				color: this.mapToInternalColor(source.COLOR_RESOURCE_NAME),
				mediaType: mediaType,
				owner: ''
			},
			mediaItems: source.MEDIA_ITEMS ? this.mapToInternalMediaItems(mediaType, source.MEDIA_ITEMS) : undefined
		};
	}

	/**
	 * Helper to map the color
	 * @param source the source
	 * @returns the target
	 */
	private mapToInternalColor(source: OldAppColor): string {

		switch(source) {

			case 'blue': return '#3c82eb';
			case 'cyan': return '#4bead7';
			case 'green': return '#74eb74';
			case 'grey': return '#6e6d66';
			case 'orange': return '#ee9b52';
			case 'purple': return '#e75fe7';
			case 'red': return '#f25a5a';
			case 'yellow': return '#f5e064';
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}

	/**
	 * Helper to map the media type
	 * @param source the source
	 * @returns the target
	 */
	private mapToInternalMediaType(source: OldAppMediaType): MediaTypeInternal {

		switch(source) {

			case 'BOOKS': return 'BOOK';
			case 'MOVIES': return 'MOVIE';
			case 'TV_SHOWS': return 'TV_SHOW';
			case 'VIDEOGAMES': return 'VIDEOGAME';
			default: throw AppError.GENERIC.withDetails(`Cannot map ${source}`);
		}
	}

	/**
	 * Helper to map the list of media items
	 * @param mediaType the source media type
	 * @param mediaItems the source media items
	 * @returns the target
	 */
	private mapToInternalMediaItems(mediaType: MediaTypeInternal, mediaItems: OldAppMediaItem[]): OldAppMediaItemInternal<MediaItemInternal>[] {

		switch(mediaType) {

			case 'BOOK':
				return oldAppBookMapper.toInternalList(mediaItems);

			case 'MOVIE':
				return oldAppMovieMapper.toInternalList(mediaItems);

			case 'TV_SHOW':
				return oldAppTvShowMapper.toInternalList(mediaItems);

			case 'VIDEOGAME':
				return oldAppVideogameMapper.toInternalList(mediaItems);

			default:
				throw AppError.GENERIC.withDetails(`Cannot map media items for ${mediaType}`);
		}
	}
}

/**
 * Singleton instance of the old Media Tracker app category mapper
 */
export const oldAppCategoryMapper = new OldAppCategoryMapper();
