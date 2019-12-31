import { movieCatalogController } from 'app/controllers/catalogs/media-items/movie';
import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { movieCatalogDetailsMapper, movieCatalogSearchMapper, movieFilterMapper, movieMapper, movieSortMapper } from 'app/data/mappers/media-items/movie';
import { AddMovieRequest, FilterMoviesRequest, FilterMoviesResponse, GetAllMoviesResponse, GetMovieFromCatalogResponse, SearchMovieCatalogResponse, SearchMoviesRequest, SearchMoviesResponse, UpdateMovieRequest } from 'app/data/models/api/media-items/movie';
import { CatalogMovieInternal, MovieFilterInternal, MovieInternal, MovieSortByInternal, SearchMovieCatalogResultInternal } from 'app/data/models/internal/media-items/movie';
import { MediaItemCatalogRouterBuilder, MediaItemEntityRouterBuilder } from 'app/routes/media-items/media-item';

const PATH_NAME = 'movies';

// Initialize the entity router builder helper
const entityRouterBuilder = new MediaItemEntityRouterBuilder<MovieInternal, MovieSortByInternal, MovieFilterInternal>(
	PATH_NAME,
	movieEntityController
);

// Initialize the catalog router builder helper
const catalogRouterBuilder = new MediaItemCatalogRouterBuilder<SearchMovieCatalogResultInternal, CatalogMovieInternal>(
	PATH_NAME,
	movieCatalogController
);

// Setup 'get all' API
entityRouterBuilder.getAll({

	responseBuilder: (commonResponse, movies) => {
		const response: GetAllMoviesResponse = {
			...commonResponse,
			movies: movieMapper.toExternalList(movies)
		};
		return response;
	}
});

// Setup 'filter and order' API
entityRouterBuilder.filter({

	requestClass: FilterMoviesRequest,

	filterRequestReader: (request) => {
		return request.filter ? movieFilterMapper.toInternal(request.filter) : undefined;
	},

	sortRequestReader: (request) => {
		return request.sortBy ? movieSortMapper.toInternalList(request.sortBy) : undefined;
	},

	responseBuilder: (commonResponse, movies) => {
		const response: FilterMoviesResponse = {
			...commonResponse,
			movies: movieMapper.toExternalList(movies)
		};
		return response;
	}
});

// Setup 'search' API
entityRouterBuilder.search({

	requestClass: SearchMoviesRequest,

	filterRequestReader: (request) => {
		return request.filter ? movieFilterMapper.toInternal(request.filter) : undefined;
	},

	responseBuilder: (commonResponse, movies) => {
		const response: SearchMoviesResponse = {
			...commonResponse,
			movies: movieMapper.toExternalList(movies)
		};
		return response;
	}
});

// Setup 'add new' API
entityRouterBuilder.addNew({

	requestClass: AddMovieRequest,

	mediaItemRequestReader: (request, mediaItemId, userId, categoryId) => {
		return movieMapper.toInternal({ ...request.newMovie, uid: mediaItemId }, { userId, categoryId });
	}
});

// Setup 'update' API
entityRouterBuilder.updateExisting({

	requestClass: UpdateMovieRequest,

	mediaItemRequestReader: (request, mediaItemId, userId, categoryId) => {
		return movieMapper.toInternal({ ...request.movie, uid: mediaItemId }, { userId, categoryId });
	}
});

// Setup 'delete' API
entityRouterBuilder.delete();

// Setup 'catalog search' API
catalogRouterBuilder.search({

	responseBuilder: (commonResponse, movies) => {
		const response: SearchMovieCatalogResponse = {
			...commonResponse,
			searchResults: movieCatalogSearchMapper.toExternalList(movies)
		};
		return response;
	}
});

// Setup 'catalog details' API
catalogRouterBuilder.details({

	responseBuilder: (commonResponse, movie) => {
		const response: GetMovieFromCatalogResponse = {
			...commonResponse,
			catalogMovie: movieCatalogDetailsMapper.toExternal(movie)
		};
		return response;
	}
});

/**
 * The movies entities router
 */
export const movieEntityRouter = entityRouterBuilder.router;

/**
 * The movies catalog router
 */
export const movieCatalogRouter = catalogRouterBuilder.router;
