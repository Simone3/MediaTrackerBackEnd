import { Document } from "mongoose";
import { MediaItemEntityController } from "./media-item";
import { MovieInternal, MovieSortByInternal, MovieFilterInternal } from "../../../models/internal/media-items/movie";
import { Model, model } from "mongoose";
import { MOVIE_COLLECTION_NAME, MovieSchema } from "../../../schemas/media-items/movie";
import { Queryable, SortDirection, Sortable } from "../../../controllers/database/query-helper";
import { MediaItemInternal } from "../../../models/internal/media-items/media-item";

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
	 * @override
	 */
	protected getModelType(): Model<MovieInternal & Document> {
		
		return MovieModel;
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
	protected setSortConditions(sortBy: MovieSortByInternal, sortDirection: SortDirection, sortConditions: Sortable<MediaItemInternal>): void {
		
		switch(sortBy.field) {

			case 'DIRECTOR':
				sortConditions.importance = sortDirection;
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
			director: termRegExp
		});
	}
}

/**
 * Singleton implementation of the movie entity controller
 */
export const movieEntityController = new MovieEntityController();

