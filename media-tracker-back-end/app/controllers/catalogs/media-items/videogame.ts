import { config } from 'app/config/config';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { logger } from 'app/loggers/logger';
import { videogameExternalDetailsServiceMapper, videogameExternalSearchServiceMapper } from 'app/mappers/external-services/videogame';
import { AppError } from 'app/models/error/error';
import { GiantBombDetailsResponse, GiantBombSearchResponse } from 'app/models/external-services/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal } from 'app/models/internal/media-items/videogame';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Controller for videogame catalog
 */
class VideogameCatalogController extends MediaItemCatalogController<SearchVideogameCatalogResultInternal, CatalogVideogameInternal> {
	
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchVideogameCatalogResultInternal[]> {

		return new Promise((resolve, reject): void => {
		
			const url = miscUtils.buildUrl([
				config.externalApis.giantBomb.basePath,
				config.externalApis.giantBomb.search.relativePath
			]);

			const queryParams = Object.assign({}, config.externalApis.giantBomb.search.queryParams);
			queryParams.query = searchTerm;
			
			const invocationParams = {
				url: url,
				responseBodyClass: GiantBombSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invokeGet(invocationParams)
				.then((response) => {

					if(response.results) {

						resolve(videogameExternalSearchServiceMapper.toInternalList(response.results));
					}
					else {

						resolve([]);
					}
				})
				.catch((error) => {
					
					logger.error('Videogame catalog invocation error: %s', error);
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}
	
	/**
	 * @override
	 */
	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogVideogameInternal> {

		return new Promise((resolve, reject): void => {
		
			const pathParams = {
				videogameId: catalogItemId
			};

			const url = miscUtils.buildUrl([
				config.externalApis.giantBomb.basePath,
				config.externalApis.giantBomb.details.relativePath
			], pathParams);

			const queryParams = Object.assign({}, config.externalApis.giantBomb.details.queryParams);

			const invocationParams = {
				url: url,
				responseBodyClass: GiantBombDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invokeGet(invocationParams)
				.then((response) => {

					resolve(videogameExternalDetailsServiceMapper.toInternal(response));
				})
				.catch((error) => {
					
					logger.error('Videogame catalog invocation error: %s', error);
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}
}

/**
 * Singleton implementation of the videogame catalog controller
 */
export const videogameCatalogController = new VideogameCatalogController();

