import { CatalogMediaItem, MediaItem, MediaItemSortField, MediaItemSortBy, AddMediaItemRequest, GetAllMediaItemsResponse, UpdateMediaItemRequest, FilterMediaItemsRequest, MediaItemFilter, FilterMediaItemsResponse, SearchMediaItemsRequest, SearchMediaItemsResponse, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, GetMediaItemFromCatalogResponse } from "./media-item";
import { IsString, IsOptional, IsNotEmpty, IsIn, IsDefined, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

/**
 * Model for a book from the catalog, publicly exposed via API
 */
export class CatalogBook extends CatalogMediaItem {

	/**
	 * The book author
	 */
	@IsOptional()
	@IsString()
	author?: string;
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
	author?: string;
};

/**
 * Model for a book with an ID property, publicly exposed via API
 */
export class IdentifiedBook extends Book {

	/**
	 * The book unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};

/**
 * Book filtering options, publicly exposed via API
 */
export class BookFilter extends MediaItemFilter{

}

/**
 * Values for book ordering options, publicly exposed via API
 */
export class BookSortField extends MediaItemSortField {

	static readonly AUTHOR: string = 'AUTHOR';
	
	public static values(): string[] {

		return [...MediaItemSortField.commonValues(), this.AUTHOR];
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
	field!: string;
}

/**
 * Book catalog search result, publicly exposed via API
 */
export class SearchBookCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Request for the "add book" API
 */
export class AddBookRequest extends AddMediaItemRequest {

	/**
	 * The book to add
	 */
	@IsDefined()
	@Type(() => Book)
	@ValidateNested()
	newBook!: Book;
};

/**
 * Response for the "get all books" API
 */
export class GetAllBooksResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved books
	 */
	books: IdentifiedBook[] = [];
};

/**
 * Request for the "update book" API
 */
export class UpdateBookRequest extends UpdateMediaItemRequest {

	/**
	 * The new book data to save
	 */
	@IsDefined()
	@Type(() => Book)
	@ValidateNested()
	book!: Book;
};

/**
 * Request for the "filter books" API
 */
export class FilterBooksRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => BookFilter)
	@ValidateNested()
	filter?: BookFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => BookSortBy)
	@ValidateNested()
	sortBy?: BookSortBy[];
};

/**
 * Response for the "filter books" API
 */
export class FilterBooksResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved books
	 */
	books: IdentifiedBook[] = [];
}

/**
 * Request for the "search books" API
 */
export class SearchBooksRequest extends SearchMediaItemsRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => BookFilter)
	@ValidateNested()
	filter?: BookFilter;
};

/**
 * Response for the "search books" API
 */
export class SearchBooksResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved books
	 */
	books: IdentifiedBook[] = [];
};

/**
 * Response for the "search catalog" API
 */
export class SearchBookCatalogResponse extends SearchMediaItemCatalogResponse {

};

/**
 * Response for the "get from catalog" API
 */
export class GetBookFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The book details
	 */
	catalogBook: CatalogBook = new CatalogBook();
};