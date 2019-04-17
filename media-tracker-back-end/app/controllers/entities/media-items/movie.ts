import { Document } from "mongoose";
import { MediaItemController, MediaItemCatalogController } from "./media-item";
import { MovieInternal, MovieSortByInternal, MovieFilterInternal, CatalogMovieInternal, SearchMovieCatalogResultInternal } from "../../../models/internal/media-items/movie";
import { Model, model } from "mongoose";
import { MOVIE_COLLECTION_NAME, MovieSchema } from "../../../schemas/media-items/movie";
import { Queryable, SortDirection, Sortable } from "../../../controllers/database/query-helper";
import { MediaItemInternal } from "../../../models/internal/media-items/media-item";
import { miscUtilsController } from "../../../controllers/utilities/misc-utils";
import { TheMovieDbSearchQueryParams, TheMovieDbSearchResponse, TheMovieDbDetailsQueryParams, TheMovieDbDetailsResponse } from "../../../models/external-services/media-items/movie";
import { restJsonInvoker } from "../../../controllers/external-services/rest-json-invoker";
import { logger } from "../../../loggers/logger";
import { AppError } from "../../../models/error/error";
import { config } from "../../../config/config";
import { movieExternalSearchServiceMapper, movieExternalDetailsServiceMapper } from "../../../mappers/external-services/movie";

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
class MovieController extends MediaItemController<MovieInternal, MovieSortByInternal, MovieFilterInternal> {
		
	protected getModelType(): Model<MovieInternal & Document> {
		
		return MovieModel;
	}

	protected getNewEmptyDocument(): MovieInternal & Document {

		return new MovieModel();
	}
	
	protected getDefaultSortBy(): MovieSortByInternal[] {
		
		return [{
			field: 'NAME',
			ascending: true
		}];
	}

	protected setSortConditions(sortBy: MovieSortByInternal, sortDirection: SortDirection, sortConditions: Sortable<MediaItemInternal>): void {
		
		switch(sortBy.field) {

			case 'DIRECTOR':
				sortConditions.importance = sortDirection;
				break;
			
			default:
				return this.setCommonSortConditions(sortBy.field, sortDirection, sortConditions);
		}
	}

	protected setSearchByTermConditions(_: string, termRegExp: RegExp, searchConditions: Queryable<MovieInternal>[]): void {
		
		searchConditions.push({
			director: termRegExp
		});
	}
}

/**
 * Controller for movie catalog
 */
class MovieCatalogController extends MediaItemCatalogController<SearchMovieCatalogResultInternal, CatalogMovieInternal> {

	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchMovieCatalogResultInternal[]> {

		return new Promise((resolve, reject) => {
		
			const url = miscUtilsController.buildUrl([config.externalApis.theMovieDb.basePath, config.externalApis.theMovieDb.searchRelativePath]);

			const queryParams: TheMovieDbSearchQueryParams = {
				query: searchTerm,
				api_key: config.externalApis.theMovieDb.apiKey
			};

			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: TheMovieDbSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			})
			.then((response) => {

				if(response.results) {

					resolve(movieExternalSearchServiceMapper.toInternalList(response.results));
				}
				else {

					resolve([]);
				}
			})
			.catch((error) => {
				
				logger.error('Movie catalog invocation error: %s', error);
				reject(AppError.GENERIC.unlessAppError(error));
			});
		});
	}

	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogMovieInternal> {

		return new Promise((resolve, reject) => {
		
			const pathParams = {movieId: catalogItemId};
			const url = miscUtilsController.buildUrl([config.externalApis.theMovieDb.basePath, config.externalApis.theMovieDb.getDetailsRelativePath], pathParams);

			const queryParams: TheMovieDbDetailsQueryParams = {
				append_to_response: "credits",
				api_key: config.externalApis.theMovieDb.apiKey
			};

			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: TheMovieDbDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			})
			.then((response) => {

				resolve(movieExternalDetailsServiceMapper.toInternal(response));
			})
			.catch((error) => {
				
				logger.error('Movie catalog invocation error: %s', error);
				reject(AppError.GENERIC.unlessAppError(error));
			});
		});
	}
}

/**
 * Singleton implementation of the movie entity controller
 */
export const movieController = new MovieController();

/**
 * Singleton implementation of the movie catalog controller
 */
export const movieCatalogController = new MovieCatalogController();

