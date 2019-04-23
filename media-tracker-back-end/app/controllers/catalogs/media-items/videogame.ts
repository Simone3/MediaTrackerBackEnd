import { MediaItemCatalogController } from "../../../controllers/catalogs/media-items/media-item";
import { SearchVideogameCatalogResultInternal, CatalogVideogameInternal } from "../../../models/internal/media-items/videogame";
import { miscUtilsController } from "../../../controllers/utilities/misc-utils";
import { GiantBombSearchResponse, GiantBombDetailsResponse } from "../../../models/external-services/media-items/videogame";
import { restJsonInvoker } from "../../../controllers/external-services/rest-json-invoker";
import { videogameExternalSearchServiceMapper, videogameExternalDetailsServiceMapper } from "../../../mappers/external-services/videogame";
import { logger } from "../../../loggers/logger";
import { AppError } from "../../../models/error/error";
import { config } from "../../../config/config";

/**
 * Controller for videogame catalog
 */
class VideogameCatalogController extends MediaItemCatalogController<SearchVideogameCatalogResultInternal, CatalogVideogameInternal> {
	
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchVideogameCatalogResultInternal[]> {

		return new Promise((resolve, reject) => {
		
			const url = miscUtilsController.buildUrl([
				config.externalApis.giantBomb.basePath,
				config.externalApis.giantBomb.search.relativePath
			]);

			const queryParams = Object.assign({}, config.externalApis.giantBomb.search.queryParams);
			queryParams.query = searchTerm;
			
			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: GiantBombSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			})
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
				reject(AppError.GENERIC.unlessAppError(error));
			});
		});
	}
	
	/**
	 * @override
	 */
	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogVideogameInternal> {

		return new Promise((resolve, reject) => {
		
			const pathParams = {
				videogameId: catalogItemId
			};

			const url = miscUtilsController.buildUrl([
				config.externalApis.giantBomb.basePath,
				config.externalApis.giantBomb.details.relativePath
			], pathParams);

			const queryParams = Object.assign({}, config.externalApis.giantBomb.details.queryParams);

			restJsonInvoker.invokeGet({
				url: url,
				responseBodyClass: GiantBombDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			})
			.then((response) => {

				resolve(videogameExternalDetailsServiceMapper.toInternal(response));
			})
			.catch((error) => {
				
				logger.error('Videogame catalog invocation error: %s', error);
				reject(AppError.GENERIC.unlessAppError(error));
			});
		});
	}
}

/**
 * Singleton implementation of the videogame catalog controller
 */
export const videogameCatalogController = new VideogameCatalogController();

