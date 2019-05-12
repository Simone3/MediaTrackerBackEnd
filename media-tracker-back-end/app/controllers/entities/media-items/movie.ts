import { Queryable, Sortable, SortDirection } from 'app/controllers/database/query-helper';
import { MediaItemEntityController } from 'app/controllers/entities/media-items/media-item';
import { MediaTypeInternal } from 'app/models/internal/category';
import { MovieFilterInternal, MovieInternal, MovieSortByInternal } from 'app/models/internal/media-items/movie';
import { MovieSchema, MOVIE_COLLECTION_NAME } from 'app/schemas/media-items/movie';
import { Document, Model, model } from 'mongoose';

/**
 * Movie document for Mongoose
 */
interface MovieDocument extends MovieInternal, Document {}

/**
 * Mongoose model for movies
 */
const MovieModel: Model<MovieDocument> = model<MovieDocument>(MOVIE_COLLECTION_NAME, MovieSchema);

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
	protected setSortConditions(sortBy: MovieSortByInternal, sortDirection: SortDirection, sortConditions: Sortable<MovieInternal>): void {
		
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
	protected setSearchByTermConditions(_: string, termRegExp: RegExp, searchConditions: Queryable<MovieInternal>[]): void {
		
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

