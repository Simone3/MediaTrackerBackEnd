import { config } from 'app/config/config';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { miscUtils } from 'app/controllers/utilities/misc-utils';
import { logger } from 'app/loggers/logger';
import { bookExternalDetailsServiceMapper, bookExternalSearchServiceMapper } from 'app/mappers/external-services/book';
import { AppError } from 'app/models/error/error';
import { GoogleBooksDetailsResponse, GoogleBooksSearchResponse } from 'app/models/external-services/media-items/book';
import { CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/models/internal/media-items/book';

/**
 * Controller for book catalog
 */
class BookCatalogController extends MediaItemCatalogController<SearchBookCatalogResultInternal, CatalogBookInternal> {
	
	/**
	 * @override
	 */
	public searchMediaItemCatalogByTerm(searchTerm: string): Promise<SearchBookCatalogResultInternal[]> {

		return new Promise((resolve, reject): void => {
		
			const url = miscUtils.buildUrl([
				config.externalApis.googleBooks.basePath,
				config.externalApis.googleBooks.search.relativePath
			]);

			const queryParams = Object.assign({}, config.externalApis.googleBooks.search.queryParams);
			queryParams.q = searchTerm;
			
			const invocationParams = {
				url: url,
				responseBodyClass: GoogleBooksSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};
			
			restJsonInvoker.invokeGet(invocationParams)
				.then((response) => {

					if(response.items) {

						resolve(bookExternalSearchServiceMapper.toInternalList(response.items));
					}
					else {

						resolve([]);
					}
				})
				.catch((error) => {
					
					logger.error('Book catalog invocation error: %s', error);
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}
	
	/**
	 * @override
	 */
	public getMediaItemFromCatalog(catalogItemId: string): Promise<CatalogBookInternal> {

		return new Promise((resolve, reject): void => {
		
			const pathParams = {
				bookId: catalogItemId
			};

			const url = miscUtils.buildUrl([
				config.externalApis.googleBooks.basePath,
				config.externalApis.googleBooks.details.relativePath
			], pathParams);

			const queryParams = Object.assign({}, config.externalApis.googleBooks.details.queryParams);

			const invocationParams = {
				url: url,
				responseBodyClass: GoogleBooksDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invokeGet(invocationParams)
				.then((response) => {

					resolve(bookExternalDetailsServiceMapper.toInternal(response));
				})
				.catch((error) => {
					
					logger.error('Book catalog invocation error: %s', error);
					reject(AppError.GENERIC.withDetails(error));
				});
		});
	}
}

/**
 * Singleton implementation of the book catalog controller
 */
export const bookCatalogController = new BookCatalogController();

