import { parseOldAppBoolean, parseOldAppDate, parseOldAppMultiValueString } from 'app/data/mappers/import/old-app/common';
import { OldAppMediaItemMapper } from 'app/data/mappers/import/old-app/media-items/media-item';
import { OldAppMediaItem } from 'app/data/models/api/import/old-app/media-item';
import { OldAppMediaItemInternal } from 'app/data/models/internal/import/old-app/media-item';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';

/**
 * Mapper from the old Media Tracker app export TV show to the new internal model
 */
class OldAppTvShowMapper extends OldAppMediaItemMapper<TvShowInternal> {

	/**
	 * @override
	 */
	protected convertToInternal(source: OldAppMediaItem): OldAppMediaItemInternal<TvShowInternal> {
		
		const common = this.commonToInternal(source);
		return {
			...common,
			mediaItemData: {
				...common.mediaItemData,
				creators: source.CREATED_BY ? parseOldAppMultiValueString(source.CREATED_BY) : undefined,
				averageEpisodeRuntimeMinutes: source.EPISODE_RUNTIME_MIN ? Number(source.EPISODE_RUNTIME_MIN) : undefined,
				seasons: undefined,
				inProduction: parseOldAppBoolean(source.IN_PRODUCTION),
				nextEpisodeAirDate: source.NEXT_EPISODE_AIR_DATE ? parseOldAppDate(source.NEXT_EPISODE_AIR_DATE) : undefined
			}
		};
	}
}

/**
 * Singleton instance of the old Media Tracker app TV show mapper
 */
export const oldAppTvShowMapper = new OldAppTvShowMapper();
