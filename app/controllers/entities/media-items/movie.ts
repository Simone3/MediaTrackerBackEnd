import { Sortable } from 'app/controllers/database/query-helper';
import { MediaItemEntityController } from 'app/controllers/entities/media-items/media-item';
import { MediaTypeInternal } from 'app/data/models/internal/category';
import { MovieFilterInternal, MovieInternal, MovieSortByInternal } from 'app/data/models/internal/media-items/movie';
import { MovieSchema, MOVIE_COLLECTION_NAME } from 'app/schemas/media-items/movie';
import { Document, FilterQuery, Model, model, SortOrder } from 'mongoose';

/**
 * Movie document for Mongoose
 */
interface MovieDocument extends MovieInternal, Document {}

/**
 * Mongoose model for movies
 */
const MovieModel: Model<MovieDocument> = model<MovieDocument>(MOVIE_COLLECTION_NAME, MovieSchema);

/**
 * Helper type for movie query conditions
 */
type QueryConditions = FilterQuery<MovieInternal>;

/**
 * Controller for movie entities
 */
class MovieEntityController extends MediaItemEntityController<MovieInternal, MovieSortByInternal, MovieFilterInternal> {
		
	/**
	 * Constructor
	 */
	public constructor() {

		super(MovieModel);
	}
	
	/**
	 * @override
	 */
	protected getNewEmptyDocument(): MovieInternal & Document {

		return new MovieModel();
	}
		
	/**
	 * @override
	 */
	protected getDefaultSortBy(): MovieSortByInternal[] {
		
		return [{
			field: 'NAME',
			ascending: true
		}];
	}

	/**
	 * @override
	 */
	protected addConditionsFromFilter(userId: string, categoryId: string, andConditions: QueryConditions[], filterBy?: MovieFilterInternal): void {
		
		this.addCommonConditionsFromFilter(userId, categoryId, andConditions, filterBy);
	}
	
	/**
	 * @override
	 */
	protected setSortConditions(sortBy: MovieSortByInternal, sortDirection: SortOrder, sortConditions: Sortable<MovieInternal>): void {
		
		switch(sortBy.field) {

			case 'DIRECTOR':
				sortConditions.directors = sortDirection;
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
			directors: termRegExp
		});
	}

	/**
	 * @override
	 */
	protected getLinkedMediaType(): MediaTypeInternal {
		
		return 'MOVIE';
	}
}

/**
 * Singleton implementation of the movie entity controller
 */
export const movieEntityController = new MovieEntityController();

