import { config } from 'app/config/config';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { miscUtilsController } from 'app/controllers/utilities/misc-utils';
import { logger } from 'app/loggers/logger';
import { movieExternalDetailsServiceMapper, movieExternalSearchServiceMapper } from 'app/mappers/external-services/movie';
import { AppError } from 'app/models/error/error';
import { TmdbMovieDetailsResponse, TmdbMovieSearchResponse } from 'app/models/external-services/media-items/movie';
import { CatalogMovieInternal, SearchMovieCatalogResultInternal } from 'app/models/internal/media-items/movie';

/**
 * Controller for movie catalog
 */
class MovieCatalogController extends MediaItemCatalogController<SearchMovieCatalogResultInternal, CatalogMovieInternal> {
	
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchMovieCatalogResultInternal[]> {

		return new Promise((resolve, reject): void => {
		
			const url = miscUtilsController.buildUrl([
				config.externalApis.theMovieDb.basePath,
				config.externalApis.theMovieDb.movies.search.relativePath
			]);

			const queryParams = Object.assign({}, config.externalApis.theMovieDb.movies.search.queryParams);
			queryParams.query = searchTerm;
			
			const invocationParams = {
				url: url,
				responseBodyClass: TmdbMovieSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invokeGet(invocationParams)
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

		return new Promise((resolve, reject): void => {
		
			const pathParams = {
				movieId: catalogItemId
			};

			const url = miscUtilsController.buildUrl([
				config.externalApis.theMovieDb.basePath,
				config.externalApis.theMovieDb.movies.details.relativePath
			], pathParams);

			const queryParams = Object.assign({}, config.externalApis.theMovieDb.movies.details.queryParams);

			const invocationParams = {
				url: url,
				responseBodyClass: TmdbMovieDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invokeGet(invocationParams)
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

