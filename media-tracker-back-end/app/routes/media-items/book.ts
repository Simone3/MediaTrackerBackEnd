import { bookCatalogController } from 'app/controllers/catalogs/media-items/book';
import { bookEntityController } from 'app/controllers/entities/media-items/book';
import { bookCatalogDetailsMapper, bookCatalogSearchMapper, bookFilterMapper, bookMapper, bookSortMapper } from 'app/mappers/media-items/book';
import { AddBookRequest, FilterBooksRequest, FilterBooksResponse, GetAllBooksResponse, GetBookFromCatalogResponse, SearchBookCatalogResponse, SearchBooksRequest, SearchBooksResponse, UpdateBookRequest } from 'app/models/api/media-items/book';
import { BookFilterInternal, BookInternal, BookSortByInternal, CatalogBookInternal, SearchBookCatalogResultInternal } from 'app/models/internal/media-items/book';
import { MediaItemCatalogRouterBuilder, MediaItemEntityRouterBuilder } from 'app/routes/media-items/media-item';

const PATH_NAME = 'books';

// Initialize the entity router builder helper
const entityRouterBuilder = new MediaItemEntityRouterBuilder<BookInternal, BookSortByInternal, BookFilterInternal>(
	PATH_NAME,
	bookEntityController
);

// Initialize the catalog router builder helper
const catalogRouterBuilder = new MediaItemCatalogRouterBuilder<SearchBookCatalogResultInternal, CatalogBookInternal>(
	PATH_NAME,
	bookCatalogController
);

// Setup 'get all' API
entityRouterBuilder.getAll({

	responseBuilder: (commonResponse, books) => {
		const response: GetAllBooksResponse = {
			...commonResponse,
			books: bookMapper.toExternalList(books)
		};
		return response;
	}
});

// Setup 'filter and order' API
entityRouterBuilder.filter({

	requestClass: FilterBooksRequest,

	filterRequestReader: (request) => {
		return request.filter ? bookFilterMapper.toInternal(request.filter) : undefined;
	},

	sortRequestReader: (request) => {
		return request.sortBy ? bookSortMapper.toInternalList(request.sortBy) : undefined;
	},

	responseBuilder: (commonResponse, books) => {
		const response: FilterBooksResponse = {
			...commonResponse,
			books: bookMapper.toExternalList(books)
		};
		return response;
	}
});

// Setup 'search' API
entityRouterBuilder.search({

	requestClass: SearchBooksRequest,

	filterRequestReader: (request) => {
		return request.filter ? bookFilterMapper.toInternal(request.filter) : undefined;
	},

	responseBuilder: (commonResponse, books) => {
		const response: SearchBooksResponse = {
			...commonResponse,
			books: bookMapper.toExternalList(books)
		};
		return response;
	}
});

// Setup 'add new' API
entityRouterBuilder.addNew({

	requestClass: AddBookRequest,

	mediaItemRequestReader: (request, mediaItemId, userId, categoryId) => {
		return bookMapper.toInternal({ ...request.newBook, uid: mediaItemId }, { userId, categoryId });
	}
});

// Setup 'update' API
entityRouterBuilder.updateExisting({

	requestClass: UpdateBookRequest,

	mediaItemRequestReader: (request, mediaItemId, userId, categoryId) => {
		return bookMapper.toInternal({ ...request.book, uid: mediaItemId }, { userId, categoryId });
	}
});

// Setup 'delete' API
entityRouterBuilder.delete();

// Setup 'catalog search' API
catalogRouterBuilder.search({

	responseBuilder: (commonResponse, books) => {
		const response: SearchBookCatalogResponse = {
			...commonResponse,
			searchResults: bookCatalogSearchMapper.toExternalList(books)
		};
		return response;
	}
});

// Setup 'catalog details' API
catalogRouterBuilder.details({

	responseBuilder: (commonResponse, book) => {
		const response: GetBookFromCatalogResponse = {
			...commonResponse,
			catalogBook: bookCatalogDetailsMapper.toExternal(book)
		};
		return response;
	}
});

/**
 * The books entities router
 */
export const bookEntityRouter = entityRouterBuilder.router;

/**
 * The books catalog router
 */
export const bookCatalogRouter = catalogRouterBuilder.router;
