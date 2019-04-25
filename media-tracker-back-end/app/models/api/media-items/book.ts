import { AddMediaItemRequest, CatalogMediaItem, FilterMediaItemsRequest, FilterMediaItemsResponse, GetAllMediaItemsResponse, GetMediaItemFromCatalogResponse, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest } from 'app/models/api/media-items/media-item';
import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Model for a book from the catalog, publicly exposed via API
 */
export class CatalogBook extends CatalogMediaItem {

	/**
	 * The book author
	 */
	@IsOptional()
	@IsString()
	public author?: string;
}

/**
 * Model for a book, publicly exposed via API
 */
export class Book extends MediaItem {

	/**
	 * The book author
	 */
	@IsOptional()
	@IsString()
	public author?: string;
}

/**
 * Model for a book with an ID property, publicly exposed via API
 */
export class IdentifiedBook extends Book {

	/**
	 * The book unique ID
	 */
	@IsNotEmpty()
	@IsString()
	public uid!: string;
}

/**
 * Book filtering options, publicly exposed via API
 */
export class BookFilter extends MediaItemFilter {

}

/**
 * Values for book ordering options, publicly exposed via API
 */
export class BookSortField extends MediaItemSortField {

	public static readonly AUTHOR: string = 'AUTHOR';
	
	public static values(): string[] {

		return [ ...MediaItemSortField.commonValues(), this.AUTHOR ];
	}
}

/**
 * Books sort by options, publicly exposed via API
 */
export class BookSortBy extends MediaItemSortBy {

	/**
	 * The sort by field
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(BookSortField.values())
	public field!: string;
}

/**
 * Book catalog search result, publicly exposed via API
 */
export class SearchBookCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Request for the 'add book' API
 */
export class AddBookRequest extends AddMediaItemRequest {

	/**
	 * The book to add
	 */
	@IsDefined()
	@Type(() => {
		return Book;
	})
	@ValidateNested()
	public newBook!: Book;
}

/**
 * Response for the 'get all books' API
 */
export class GetAllBooksResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved books
	 */
	public books: IdentifiedBook[] = [];
}

/**
 * Request for the 'update book' API
 */
export class UpdateBookRequest extends UpdateMediaItemRequest {

	/**
	 * The new book data to save
	 */
	@IsDefined()
	@Type(() => {
		return Book;
	})
	@ValidateNested()
	public book!: Book;
}

/**
 * Request for the 'filter books' API
 */
export class FilterBooksRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => {
		return BookFilter;
	})
	@ValidateNested()
	public filter?: BookFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return BookSortBy;
	})
	@ValidateNested()
	public sortBy?: BookSortBy[];
}

/**
 * Response for the 'filter books' API
 */
export class FilterBooksResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved books
	 */
	public books: IdentifiedBook[] = [];
}

/**
 * Request for the 'search books' API
 */
export class SearchBooksRequest extends SearchMediaItemsRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => {
		return BookFilter;
	})
	@ValidateNested()
	public filter?: BookFilter;
}

/**
 * Response for the 'search books' API
 */
export class SearchBooksResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved books
	 */
	public books: IdentifiedBook[] = [];
}

/**
 * Response for the 'search catalog' API
 */
export class SearchBookCatalogResponse extends SearchMediaItemCatalogResponse {

}

/**
 * Response for the 'get from catalog' API
 */
export class GetBookFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The book details
	 */
	public catalogBook: CatalogBook = new CatalogBook();
}
