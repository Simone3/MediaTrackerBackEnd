import { MediaItemCatalogDetailsMapper, MediaItemCatalogSearchMapper, MediaItemFilterMapper, MediaItemMapper, MediaItemMapperParams, MediaItemSortMapper } from 'app/mappers/media-items/media-item';
import { BookFilter, BookSortBy, BookSortField, CatalogBook, IdentifiedBook, SearchBookCatalogResult } from 'app/models/api/media-items/book';
import { BookFilterInternal, BookInternal, BookSortByInternal, BookSortFieldInternal, CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/models/internal/media-items/book';

/**
 * Mapper for books
 */
class BookMapper extends MediaItemMapper<BookInternal, IdentifiedBook> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: BookInternal): IdentifiedBook {

		return {
			...this.commonToExternal(source),
			uid: source._id,
			authors: source.authors,
			pagesNumber: source.pagesNumber
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedBook, extraParams?: MediaItemMapperParams): BookInternal {
		
		return {
			...this.commonToInternal(source, extraParams),
			_id: source.uid ? source.uid : null,
			authors: source.authors,
			pagesNumber: source.pagesNumber
		};
	}
}

/**
 * Mapper for book filters
 */
class BookFilterMapper extends MediaItemFilterMapper<BookFilterInternal, BookFilter> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: BookFilterInternal): BookFilter {
		
		return this.commonToExternal(source);
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: BookFilter): BookFilterInternal {
		
		return this.commonToInternal(source);
	}
}

/**
 * Mapper for book sort options
 */
class BookSortMapper extends MediaItemSortMapper<BookSortByInternal, BookSortBy> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: BookSortByInternal): BookSortBy {
		
		return {
			...this.commonToExternal(source),
			field: this.toExternalField(source.field)
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: BookSortBy): BookSortByInternal {
		
		return {
			...this.commonToInternal(source),
			field: this.toInternalField(source.field)
		};
	}
	
	/**
	 * Helper to translate the sort field enumeration
	 */
	protected toExternalField(source: BookSortFieldInternal): string {

		switch(source) {
			
			case 'AUTHOR': return BookSortField.AUTHOR;
			default: return this.commonToExternalField(source);
		}
	}
	
	/**
	 * Helper to translate the sort field enumeration
	 */
	protected toInternalField(source: string): BookSortFieldInternal {

		switch(source) {
			
			case BookSortField.AUTHOR: return 'AUTHOR';
			default: return this.commonToInternalField(source);
		}
	}
}

/**
 * Mapper for book catalog search results
 */
class BookCatalogSearchMapper extends MediaItemCatalogSearchMapper<SearchBookCatalogResultInternal, SearchBookCatalogResult> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: SearchBookCatalogResultInternal): SearchBookCatalogResult {

		return this.commonToExternal(source);
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: SearchBookCatalogResult): SearchBookCatalogResultInternal {

		return this.commonToInternal(source);
	}
}

/**
 * Mapper for book catalog details
 */
class BookCatalogDetailsMapper extends MediaItemCatalogDetailsMapper<CatalogBookInternal, CatalogBook> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: CatalogBookInternal): CatalogBook {

		return {
			...this.commonToExternal(source),
			authors: source.authors,
			pagesNumber: source.pagesNumber
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: CatalogBook): CatalogBookInternal {

		return {
			...this.commonToInternal(source),
			authors: source.authors,
			pagesNumber: source.pagesNumber
		};
	}
}

/**
 * Singleton instance of the books mapper
 */
export const bookMapper = new BookMapper();

/**
 * Singleton instance of the books filter mapper
 */
export const bookFilterMapper = new BookFilterMapper();

/**
 * Singleton instance of the books sort mapper
 */
export const bookSortMapper = new BookSortMapper();

/**
 * Singleton instance of the books catalog search mapper
 */
export const bookCatalogSearchMapper = new BookCatalogSearchMapper();

/**
 * Singleton instance of the books catalog details mapper
 */
export const bookCatalogDetailsMapper = new BookCatalogDetailsMapper();
