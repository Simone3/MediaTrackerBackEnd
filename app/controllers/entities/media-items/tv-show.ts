import { Sortable } from 'app/controllers/database/query-helper';
import { MediaItemEntityController } from 'app/controllers/entities/media-items/media-item';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { TvShowFilterInternal, TvShowInternal, TvShowSortByInternal } from 'app/data/models/internal/media-items/tv-show';
import { TvShowSchema, TV_SHOW_COLLECTION_NAME } from 'app/schemas/media-items/tv-show';
import { Document, FilterQuery, Model, model, SortOrder } from 'mongoose';

/**
 * TvShow document for Mongoose
 */
interface TvShowDocument extends TvShowInternal, Document {}

/**
 * Mongoose model for TV shows
 */
const TvShowModel: Model<TvShowDocument> = model<TvShowDocument>(TV_SHOW_COLLECTION_NAME, TvShowSchema);

/**
 * Helper type for TV show query conditions
 */
type QueryConditions = FilterQuery<TvShowInternal>;

/**
 * Controller for TV show entities
 */
class TvShowEntityController extends MediaItemEntityController<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal> {
	
	/**
	 * Constructor
	 */
	public constructor() {

		super(TvShowModel);
	}
	
	/**
	 * @override
	 */
	protected getNewEmptyDocument(): TvShowInternal & Document {

		return new TvShowModel();
	}
		
	/**
	 * @override
	 */
	protected getDefaultSortBy(): TvShowSortByInternal[] {
		
		return [{
			field: 'NAME',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	protected addConditionsFromFilter(userId: string, categoryId: string, andConditions: QueryConditions[], filterBy?: TvShowFilterInternal): void {
		
		this.addCommonConditionsFromFilter(userId, categoryId, andConditions, filterBy);
	}
	
	/**
	 * @override
	 */
	protected setSortConditions(sortBy: TvShowSortByInternal, sortDirection: SortOrder, sortConditions: Sortable<TvShowInternal>): void {
		
		switch(sortBy.field) {

			case 'CREATOR':
				sortConditions.creators = sortDirection;
				break;
			
			default:
				return this.setCommonSortConditions(sortBy.field, sortDirection, sortConditions);
		}
	}
	
	/**
	 * @override
	 */
	protected setSearchByTermConditions(_: string, termRegExp: RegExp, searchConditions: QueryConditions[]): void {
		
		searchConditions.push({
			creators: termRegExp
		});
	}

	/**
	 * @override
	 */
	protected getLinkedMediaType(): MediaTypeInternal {
		
		return 'TV_SHOW';
	}
}

/**
 * Singleton implementation of the TV show entity controller
 */
export const tvShowEntityController = new TvShowEntityController();

