import { parseOldAppMultiValueString } from 'app/data/mappers/import/old-app/common';
import { OldAppMediaItemMapper } from 'app/data/mappers/import/old-app/media-items/media-item';
import { OldAppMediaItem } from 'app/data/models/api/import/old-app/media-item';
import { OldAppMediaItemInternal } from 'app/data/models/internal/import/old-app/media-item';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';

/**
 * Mapper from the old Media Tracker app export videogame to the new internal model
 */
class OldAppVideogameMapper extends OldAppMediaItemMapper<VideogameInternal> {

	/**
	 * @override
	 */
	protected convertToInternal(source: OldAppMediaItem): OldAppMediaItemInternal<VideogameInternal> {
		
		const common = this.commonToInternal(source);
		return {
			...common,
			mediaItemData: {
				...common.mediaItemData,
				developers: source.DEVELOPER ? parseOldAppMultiValueString(source.DEVELOPER) : undefined,
				publishers: source.PUBLISHER ? parseOldAppMultiValueString(source.PUBLISHER) : undefined,
				platforms: source.PLATFORMS ? parseOldAppMultiValueString(source.PLATFORMS) : undefined,
				averageLengthHours: source.AVERAGE_LENGTH_HOURS ? Number(source.AVERAGE_LENGTH_HOURS) : undefined
			}
		};
	}
}

/**
 * Singleton instance of the old Media Tracker app videogame mapper
 */
export const oldAppVideogameMapper = new OldAppVideogameMapper();
