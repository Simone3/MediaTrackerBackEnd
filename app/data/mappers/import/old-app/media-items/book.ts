import { parseOldAppMultiValueString } from 'app/data/mappers/import/old-app/common';
import { OldAppMediaItemMapper } from 'app/data/mappers/import/old-app/media-items/media-item';
import { OldAppMediaItem } from 'app/data/models/api/import/old-app/media-item';
import { OldAppMediaItemInternal } from 'app/data/models/internal/import/old-app/media-item';
import { BookInternal } from 'app/data/models/internal/media-items/book';

/**
 * Mapper from the old Media Tracker app export book to the new internal model
 */
class OldAppBookMapper extends OldAppMediaItemMapper<BookInternal> {

	/**
	 * @override
	 */
	protected convertToInternal(source: OldAppMediaItem): OldAppMediaItemInternal<BookInternal> {
		
		const common = this.commonToInternal(source);
		return {
			...common,
			mediaItemData: {
				...common.mediaItemData,
				authors: source.AUTHOR ? parseOldAppMultiValueString(source.AUTHOR) : undefined,
				pagesNumber: source.PAGES_NUMBER ? Number(source.PAGES_NUMBER) : undefined
			}
		};
	}
}

/**
 * Singleton instance of the old Media Tracker app book mapper
 */
export const oldAppBookMapper = new OldAppBookMapper();
