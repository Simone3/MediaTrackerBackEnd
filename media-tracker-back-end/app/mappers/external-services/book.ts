import { ModelMapper } from 'app/mappers/common';
import { AppError } from 'app/models/error/error';
import { GoogleBooksDetailsResponse, GoogleBooksSearchResult, GoogleBooksVolumeFull } from 'app/models/external-services/media-items/book';
import { CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/models/internal/media-items/book';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Mapper for the books search external service
 */
class BookExternalSearchServiceMapper extends ModelMapper<SearchBookCatalogResultInternal, GoogleBooksSearchResult, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): GoogleBooksSearchResult {

		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: GoogleBooksSearchResult): SearchBookCatalogResultInternal {
		
		return {
			catalogId: source.id,
			name: source.volumeInfo.title,
			releaseDate: dateUtils.toDate(source.volumeInfo.publishedDate)
		};
	}
}

/**
 * Mapper for the books details external service
 */
class BookExternalDetailsServiceMapper extends ModelMapper<CatalogBookInternal, GoogleBooksDetailsResponse, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): GoogleBooksDetailsResponse {

		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: GoogleBooksDetailsResponse): CatalogBookInternal {
		
		return {
			name: source.volumeInfo.title,
			genres: miscUtils.filterAndSortValues(source.volumeInfo.categories),
			description: source.volumeInfo.description,
			releaseDate: dateUtils.toDate(source.volumeInfo.publishedDate),
			imageUrl: this.getImageUrl(source.volumeInfo),
			authors: miscUtils.filterAndSortValues(source.volumeInfo.authors),
			pagesNumber: source.volumeInfo.pageCount
		};
	}

	/**
	 * Helper to get the image URL
	 */
	private getImageUrl(volumeInfo: GoogleBooksVolumeFull): string | undefined {
		
		if(volumeInfo.imageLinks) {

			if(volumeInfo.imageLinks.medium) {

				return volumeInfo.imageLinks.medium;
			}
			else if(volumeInfo.imageLinks.thumbnail) {

				return volumeInfo.imageLinks.thumbnail;
			}
		}

		return undefined;
	}
}

/**
 * Singleton instance of book search external service mapper
 */
export const bookExternalSearchServiceMapper = new BookExternalSearchServiceMapper();

/**
 * Singleton instance of book details external service mapper
 */
export const bookExternalDetailsServiceMapper = new BookExternalDetailsServiceMapper();

