import { config } from 'app/config/config';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { restJsonInvoker } from 'app/controllers/external-services/rest-json-invoker';
import { bookExternalDetailsServiceMapper, bookExternalSearchServiceMapper } from 'app/data/mappers/external-services/book';
import { AppError } from 'app/data/models/error/error';
import { GoogleBooksDetailsResponse, GoogleBooksSearchResponse } from 'app/data/models/external-services/media-items/book';
import { CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/data/models/internal/media-items/book';
import { logger } from 'app/loggers/logger';
import { InvocationParams } from 'app/utilities/helper-types';
import { miscUtils } from 'app/utilities/misc-utils';

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

			const queryParams = miscUtils.objectToStringKeyValue(config.externalApis.googleBooks.search.queryParams);
			queryParams.q = searchTerm;
			
			const invocationParams: InvocationParams<undefined, GoogleBooksSearchResponse> = {
				method: 'GET',
				url: url,
				responseBodyClass: GoogleBooksSearchResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};
			
			restJsonInvoker.invoke(invocationParams)
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

			const queryParams = miscUtils.objectToStringKeyValue(config.externalApis.googleBooks.details.queryParams);

			const invocationParams: InvocationParams<undefined, GoogleBooksDetailsResponse> = {
				method: 'GET',
				url: url,
				responseBodyClass: GoogleBooksDetailsResponse,
				queryParams: queryParams,
				timeoutMilliseconds: config.externalApis.timeoutMilliseconds
			};

			restJsonInvoker.invoke(invocationParams)
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

