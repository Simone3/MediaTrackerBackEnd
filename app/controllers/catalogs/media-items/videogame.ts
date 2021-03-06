import { config } from 'app/config/config';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { videogameExternalDetailsServiceMapper, videogameExternalSearchServiceMapper } from 'app/data/mappers/external-services/videogame';
import { AppError } from 'app/data/models/error/error';
import { GiantBombDetailsResponse, GiantBombSearchResponse } from 'app/data/models/external-services/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal } from 'app/data/models/internal/media-items/videogame';
import { logger } from 'app/loggers/logger';
import { InvocationParams } from 'app/utilities/helper-types';
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

			const queryParams = miscUtils.objectToStringKeyValue(config.externalApis.giantBomb.search.queryParams);
			queryParams.query = searchTerm;
			
			const invocationParams: InvocationParams<undefined, GiantBombSearchResponse> = {
				method: 'GET',
				url: url,
				responseBodyClass: GiantBombSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invoke(invocationParams)
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

			const queryParams = miscUtils.objectToStringKeyValue(config.externalApis.giantBomb.details.queryParams);

			const invocationParams: InvocationParams<undefined, GiantBombDetailsResponse> = {
				method: 'GET',
				url: url,
				responseBodyClass: GiantBombDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invoke(invocationParams)
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

