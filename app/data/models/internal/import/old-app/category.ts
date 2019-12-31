import { CategoryInternal } from 'app/data/models/internal/category';
import { OldAppMediaItemInternal } from 'app/data/models/internal/import/old-app/media-item';
import { MediaItemInternal } from '../../media-items/media-item';

/**
 * Model for the old Media Tracker app category, internal type NOT to be exposed via API
 */
export type OldAppCategoryInternal = {

	categoryData: CategoryInternal;
	mediaItems?: OldAppMediaItemInternal<MediaItemInternal>[];
}
