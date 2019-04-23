import { MediaItemCatalogController } from "../../../controllers/catalogs/media-items/media-item";
import { SearchMovieCatalogResultInternal, CatalogMovieInternal } from "../../../models/internal/media-items/movie";
import { miscUtilsController } from "../../../controllers/utilities/misc-utils";
import { TmdbMovieSearchQueryParams, TmdbMovieSearchResponse, TmdbMovieDetailsQueryParams, TmdbMovieDetailsResponse } from "../../../models/external-services/media-items/movie";
import { restJsonInvoker } from "../../../controllers/external-services/rest-json-invoker";
import { movieExternalSearchServiceMapper, movieExternalDetailsServiceMapper } from "../../../mappers/external-services/movie";
import { logger } from "../../../loggers/logger";
import { AppError } from "../../../models/error/error";
import { config } from "../../../config/config";

/**
 * Controller for movie catalog
 */
class MovieCatalogController extends MediaItemCatalogController<SearchMovieCatalogResultInternal, CatalogMovieInternal> {
	
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchMovieCatalogResultInternal[]> {

		return new Promise((resolve, reject) => {
		
			const url = miscUtilsController.buildUrl([
				config.externalApis.theMovieDb.basePath,
				config.externalApis.theMovieDb.movies.searchRelativePath
			]);

			const queryParams: TmdbMovieSearchQueryParams = {
				query: searchTerm,
				api_key: config.externalApis.theMovieDb.apiKey
			};

			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: TmdbMovieSearchResponse,
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
	
	/**
	 * @override
	 */
	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogMovieInternal> {

		return new Promise((resolve, reject) => {
		
			const pathParams = {
				movieId: catalogItemId
			};

			const url = miscUtilsController.buildUrl([
				config.externalApis.theMovieDb.basePath,
				config.externalApis.theMovieDb.movies.getDetailsRelativePath
			], pathParams);

			const queryParams: TmdbMovieDetailsQueryParams = {
				append_to_response: "credits",
				api_key: config.externalApis.theMovieDb.apiKey
			};

			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: TmdbMovieDetailsResponse,
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
 * Singleton implementation of the movie catalog controller
 */
export const movieCatalogController = new MovieCatalogController();

