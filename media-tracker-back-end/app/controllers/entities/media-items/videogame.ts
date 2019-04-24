import { Queryable, Sortable, SortDirection } from "app/controllers/database/query-helper";
import { MediaItemEntityController } from "app/controllers/entities/media-items/media-item";
import { MediaTypeInternal } from "app/models/internal/category";
import { VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from "app/models/internal/media-items/videogame";
import { VideogameSchema, VIDEOGAME_COLLECTION_NAME } from "app/schemas/media-items/videogame";
import { Document, Model, model } from "mongoose";

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
	 * Constructor
	 */
	constructor() {

		super(VideogameModel);
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


