import { parseOldAppMultiValueString } from 'app/data/mappers/import/old-app/common';
import { OldAppMediaItemMapper } from 'app/data/mappers/import/old-app/media-items/media-item';
import { OldAppMediaItem } from 'app/data/models/api/import/old-app/media-item';
import { OldAppMediaItemInternal } from 'app/data/models/internal/import/old-app/media-item';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';

/**
 * Mapper from the old Media Tracker app export movie to the new internal model
 */
class OldAppMovieMapper extends OldAppMediaItemMapper<MovieInternal> {

	/**
	 * @override
	 */
	protected convertToInternal(source: OldAppMediaItem): OldAppMediaItemInternal<MovieInternal> {
		
		const common = this.commonToInternal(source);
		return {
			...common,
			mediaItemData: {
				...common.mediaItemData,
				directors: source.DIRECTOR ? parseOldAppMultiValueString(source.DIRECTOR) : undefined,
				durationMinutes: source.DURATION_MIN ? Number(source.DURATION_MIN) : undefined
			}
		};
	}
}

/**
 * Singleton instance of the old Media Tracker app movie mapper
 */
export const oldAppMovieMapper = new OldAppMovieMapper();
