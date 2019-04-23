import { MediaItemEntityRouterBuilder, MediaItemCatalogRouterBuilder } from "./media-item";
import { GetAllTvShowsResponse, FilterTvShowsResponse, FilterTvShowsRequest, SearchTvShowsRequest, SearchTvShowsResponse, AddTvShowRequest, UpdateTvShowRequest, SearchTvShowCatalogResponse, GetTvShowFromCatalogResponse } from "../../models/api/media-items/tv-show";
import { TvShowInternal, TvShowSortByInternal, TvShowFilterInternal, CatalogTvShowInternal, SearchTvShowCatalogResultInternal } from "../../models/internal/media-items/tv-show";
import { tvShowEntityController } from "../../controllers/entities/media-items/tv-show";
import { tvShowMapper, tvShowFilterMapper, tvShowSortMapper, tvShowCatalogSearchMapper, tvShowCatalogDetailsMapper } from "../../mappers/media-items/tv-show";
import { tvShowCatalogController } from "../../controllers/catalogs/media-items/tv-show";

const PATH_NAME = 'tv-shows';

// Initialize the entity router builder helper
const entityRouterBuilder = new MediaItemEntityRouterBuilder<TvShowInternal, TvShowSortByInternal, TvShowFilterInternal>(
	PATH_NAME,
	tvShowEntityController
);

// Initialize the catalog router builder helper
const catalogRouterBuilder = new MediaItemCatalogRouterBuilder<SearchTvShowCatalogResultInternal, CatalogTvShowInternal>(
	PATH_NAME,
	tvShowCatalogController
);

// Setup "get all" API
entityRouterBuilder.getAll({

	responseBuilder: (commonResponse, tvShows) => {
		const response: GetAllTvShowsResponse = {
			...commonResponse,
			tvShows: tvShowMapper.toExternalList(tvShows)
		};
		return response;
	}
});

// Setup "filter and order" API
entityRouterBuilder.filter({

	requestClass: FilterTvShowsRequest,

	filterRequestReader: (request) => {
		return (request.filter ? tvShowFilterMapper.toInternal(request.filter) : undefined)
	},

	sortRequestReader: (request) => {
		return (request.sortBy ? tvShowSortMapper.toInternalList(request.sortBy) : undefined)
	},

	responseBuilder: (commonResponse, tvShows) => {
		const response: FilterTvShowsResponse = {
			...commonResponse,
			tvShows: tvShowMapper.toExternalList(tvShows)
		};
		return response;
	}
});

// Setup "search" API
entityRouterBuilder.search({

	requestClass: SearchTvShowsRequest,

	filterRequestReader: (request) => {
		return (request.filter ? tvShowFilterMapper.toInternal(request.filter) : undefined)
	},

	responseBuilder: (commonResponse, tvShows) => {
		const response: SearchTvShowsResponse = {
			...commonResponse,
			tvShows: tvShowMapper.toExternalList(tvShows)
		};
		return response;
	}
});

// Setup "add new" API
entityRouterBuilder.addNew({

	requestClass: AddTvShowRequest,

	mediaItemRequestReader: (request, mediaItemId, userId, categoryId) => {
		return tvShowMapper.toInternal({...request.newTvShow, uid: mediaItemId}, {userId, categoryId});
	}
});

// Setup "update" API
entityRouterBuilder.updateExisting({

	requestClass: UpdateTvShowRequest,

	mediaItemRequestReader: (request, mediaItemId, userId, categoryId) => {
		return tvShowMapper.toInternal({...request.tvShow, uid: mediaItemId}, {userId, categoryId});
	}
});

// Setup "delete" API
entityRouterBuilder.delete();

// Setup "catalog search" API
catalogRouterBuilder.search({

	responseBuilder: (commonResponse, tvShows) => {
		const response: SearchTvShowCatalogResponse = {
			...commonResponse,
			searchResults: tvShowCatalogSearchMapper.toExternalList(tvShows)
		};
		return response;
	}
});

// Setup "catalog details" API
catalogRouterBuilder.details({

	responseBuilder: (commonResponse, tvShow) => {
		const response: GetTvShowFromCatalogResponse = {
			...commonResponse,
			catalogTvShow: tvShowCatalogDetailsMapper.toExternal(tvShow)
		};
		return response;
	}
});

/**
 * The TV shows entities router
 */
export const tvShowEntityRouter = entityRouterBuilder.router;

/**
 * The TV shows catalog router
 */
export const tvShowCatalogRouter = catalogRouterBuilder.router;