import { Sortable } from 'app/controllers/database/query-helper';
import { MediaItemEntityController } from 'app/controllers/entities/media-items/media-item';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';
import { VideogameSchema, VIDEOGAME_COLLECTION_NAME } from 'app/schemas/media-items/videogame';
import { Document, FilterQuery, Model, model, SortOrder } from 'mongoose';

/**
 * Videogame document for Mongoose
 */
interface VideogameDocument extends VideogameInternal, Document {}

/**
 * Mongoose model for videogames
 */
const VideogameModel: Model<VideogameDocument> = model<VideogameDocument>(VIDEOGAME_COLLECTION_NAME, VideogameSchema);

/**
 * Helper type for videogame query conditions
 */
type QueryConditions = FilterQuery<VideogameInternal>;

/**
 * Controller for videogame entities
 */
class VideogameEntityController extends MediaItemEntityController<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal> {
	
	/**
	 * Constructor
	 */
	public constructor() {

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
	protected addConditionsFromFilter(userId: string, categoryId: string, andConditions: QueryConditions[], filterBy?: VideogameFilterInternal): void {
		
		this.addCommonConditionsFromFilter(userId, categoryId, andConditions, filterBy);
	}
	
	/**
	 * @override
	 */
	protected setSortConditions(sortBy: VideogameSortByInternal, sortDirection: SortOrder, sortConditions: Sortable<VideogameInternal>): void {
		
		switch(sortBy.field) {

			case 'DEVELOPER':
				sortConditions.developers = sortDirection;
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
			developers: termRegExp
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

