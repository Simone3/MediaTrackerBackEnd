import { Document } from "mongoose";
import { MediaItemEntityController } from "./media-item";
import { VideogameInternal, VideogameSortByInternal, VideogameFilterInternal } from "../../../models/internal/media-items/videogame";
import { Model, model } from "mongoose";
import { VIDEOGAME_COLLECTION_NAME, VideogameSchema } from "../../../schemas/media-items/videogame";
import { Queryable, SortDirection, Sortable } from "../../../controllers/database/query-helper";
import { MediaTypeInternal } from "../../../models/internal/category";

/**
 * Videogame document for Mongoose
 */
interface VideogameDocument extends VideogameInternal, Document {}

/**
 * Mongoose model for videogames
 */
const VideogameModel: Model<VideogameDocument> = model<VideogameDocument>(VIDEOGAME_COLLECTION_NAME, VideogameSchema);

/**
 * Controller for videogame entities
 */
class VideogameEntityController extends MediaItemEntityController<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal> {
	
	/**
	 * @override
	 */
	protected getModelType(): Model<VideogameInternal & Document> {
		
		return VideogameModel;
	}
	
	/**
	 * @override
	 */
	protected getNewEmptyDocument(): VideogameInternal & Document {

		return new VideogameModel();
	}
		
	/**
	 * @override
	 */
	protected getDefaultSortBy(): VideogameSortByInternal[] {
		
		return [{
			field: 'NAME',
			ascending: true
		}];
	}
	
	/**
	 * @override
	 */
	protected setSortConditions(sortBy: VideogameSortByInternal, sortDirection: SortDirection, sortConditions: Sortable<VideogameInternal>): void {
		
		switch(sortBy.field) {

			case 'DEVELOPER':
				sortConditions.developer = sortDirection;
				break;
			
			default:
				return this.setCommonSortConditions(sortBy.field, sortDirection, sortConditions);
		}
	}
	
	/**
	 * @override
	 */
	protected setSearchByTermConditions(_: string, termRegExp: RegExp, searchConditions: Queryable<VideogameInternal>[]): void {
		
		searchConditions.push({
			developer: termRegExp
		});
	}

	/**
	 * @override
	 */
	protected getLinkedMediaType(): MediaTypeInternal {
		
		return 'VIDEOGAME';
	}
}

/**
 * Singleton implementation of the videogame entity controller
 */
export const videogameEntityController = new VideogameEntityController();


