import { config } from 'app/config/config';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { movieExternalDetailsServiceMapper, movieExternalSearchServiceMapper } from 'app/data/mappers/external-services/movie';
import { AppError } from 'app/data/models/error/error';
import { TmdbMovieDetailsResponse, TmdbMovieSearchResponse } from 'app/data/models/external-services/media-items/movie';
import { CatalogMovieInternal, SearchMovieCatalogResultInternal } from 'app/data/models/internal/media-items/movie';
import { logger } from 'app/loggers/logger';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Controller for movie catalog
 */
class MovieCatalogController extends MediaItemCatalogController<SearchMovieCatalogResultInternal, CatalogMovieInternal> {
	
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchMovieCatalogResultInternal[]> {

		return new Promise((resolve, reject): void => {
		
			const url = miscUtils.buildUrl([
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
					reject(AppError.GENERIC.withDetails(error));
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

			const url = miscUtils.buildUrl([
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
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}
}

/**
 * Singleton implementation of the movie catalog controller
 */
export const movieCatalogController = new MovieCatalogController();

