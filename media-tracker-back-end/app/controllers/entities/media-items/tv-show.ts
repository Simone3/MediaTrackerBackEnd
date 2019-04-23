import { Document } from "mongoose";
import { MediaItemEntityController } from "./media-item";
import { TvShowInternal, TvShowSortByInternal, TvShowFilterInternal } from "../../../models/internal/media-items/tv-show";
import { Model, model } from "mongoose";
import { TV_SHOW_COLLECTION_NAME, TvShowSchema } from "../../../schemas/media-items/tv-show";
import { Queryable, SortDirection, Sortable } from "../../../controllers/database/query-helper";

/**
 * TvShow document for Mongoose
 */
interface TvShowDocument extends TvShowInternal, Document {}

/**
 * Mongoose model for TV shows
 */
const TvShowModel: Model<TvShowDocument> = model<TvShowDocument>(TV_SHOW_COLLECTION_NAME, TvShowSchema);

/**
 * Controller for TV show entities
 */
class TvShowEntityController extends MediaItemEntityController<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal> {
	
	/**
	 * @override
	 */
	protected getModelType(): Model<TvShowInternal & Document> {
		
		return TvShowModel;
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
	protected setSortConditions(sortBy: TvShowSortByInternal, sortDirection: SortDirection, sortConditions: Sortable<TvShowInternal>): void {
		
		switch(sortBy.field) {

			case 'CREATOR':
				sortConditions.creator = sortDirection;
				break;
			
			default:
				return this.setCommonSortConditions(sortBy.field, sortDirection, sortConditions);
		}
	}
	
	/**
	 * @override
	 */
	protected setSearchByTermConditions(_: string, termRegExp: RegExp, searchConditions: Queryable<TvShowInternal>[]): void {
		
		searchConditions.push({
			creator: termRegExp
		});
	}
}

/**
 * Singleton implementation of the TV show entity controller
 */
export const tvShowEntityController = new TvShowEntityController();


