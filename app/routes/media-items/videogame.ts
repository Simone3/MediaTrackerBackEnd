import { videogameCatalogController } from 'app/controllers/catalogs/media-items/videogame';
import { videogameEntityController } from 'app/controllers/entities/media-items/videogame';
import { videogameCatalogDetailsMapper, videogameCatalogSearchMapper, videogameFilterMapper, videogameMapper, videogameSortMapper } from 'app/data/mappers/media-items/videogame';
import { AddVideogameRequest, FilterVideogamesRequest, FilterVideogamesResponse, GetAllVideogamesResponse, GetVideogameFromCatalogResponse, SearchVideogameCatalogResponse, SearchVideogamesRequest, SearchVideogamesResponse, UpdateVideogameRequest } from 'app/data/models/api/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal, VideogameFilterInternal, VideogameInternal, VideogameSortByInternal } from 'app/data/models/internal/media-items/videogame';
import { MediaItemCatalogRouterBuilder, MediaItemEntityRouterBuilder } from 'app/routes/media-items/media-item';

const PATH_NAME = 'videogames';

// Initialize the entity router builder helper
const entityRouterBuilder = new MediaItemEntityRouterBuilder<VideogameInternal, VideogameSortByInternal, VideogameFilterInternal>(
	PATH_NAME,
	videogameEntityController
);

// Initialize the catalog router builder helper
const catalogRouterBuilder = new MediaItemCatalogRouterBuilder<SearchVideogameCatalogResultInternal, CatalogVideogameInternal>(
	PATH_NAME,
	videogameCatalogController
);

// Setup 'get all' API
entityRouterBuilder.getAll({

	responseBuilder: (commonResponse, videogames) => {
		const response: GetAllVideogamesResponse = {
			...commonResponse,
			videogames: videogameMapper.toExternalList(videogames)
		};
		return response;
	}
});

// Setup 'filter and order' API
entityRouterBuilder.filter({

	requestClass: FilterVideogamesRequest,

	filterRequestReader: (request) => {
		return request.filter ? videogameFilterMapper.toInternal(request.filter) : undefined;
	},

	sortRequestReader: (request) => {
		return request.sortBy ? videogameSortMapper.toInternalList(request.sortBy) : undefined;
	},

	responseBuilder: (commonResponse, videogames) => {
		const response: FilterVideogamesResponse = {
			...commonResponse,
			videogames: videogameMapper.toExternalList(videogames)
		};
		return response;
	}
});

// Setup 'search' API
entityRouterBuilder.search({

	requestClass: SearchVideogamesRequest,

	filterRequestReader: (request) => {
		return request.filter ? videogameFilterMapper.toInternal(request.filter) : undefined;
	},

	responseBuilder: (commonResponse, videogames) => {
		const response: SearchVideogamesResponse = {
			...commonResponse,
			videogames: videogameMapper.toExternalList(videogames)
		};
		return response;
	}
});

// Setup 'add new' API
entityRouterBuilder.addNew({

	requestClass: AddVideogameRequest,

	mediaItemRequestReader: (request, mediaItemId, userId, categoryId) => {
		return videogameMapper.toInternal({ ...request.newVideogame, uid: mediaItemId }, { userId, categoryId });
	}
});

// Setup 'update' API
entityRouterBuilder.updateExisting({

	requestClass: UpdateVideogameRequest,

	mediaItemRequestReader: (request, mediaItemId, userId, categoryId) => {
		return videogameMapper.toInternal({ ...request.videogame, uid: mediaItemId }, { userId, categoryId });
	}
});

// Setup 'delete' API
entityRouterBuilder.delete();

// Setup 'catalog search' API
catalogRouterBuilder.search({

	responseBuilder: (commonResponse, videogames) => {
		const response: SearchVideogameCatalogResponse = {
			...commonResponse,
			searchResults: videogameCatalogSearchMapper.toExternalList(videogames)
		};
		return response;
	}
});

// Setup 'catalog details' API
catalogRouterBuilder.details({

	responseBuilder: (commonResponse, videogame) => {
		const response: GetVideogameFromCatalogResponse = {
			...commonResponse,
			catalogVideogame: videogameCatalogDetailsMapper.toExternal(videogame)
		};
		return response;
	}
});

/**
 * The videogames entities router
 */
export const videogameEntityRouter = entityRouterBuilder.router;

/**
 * The videogames catalog router
 */
export const videogameCatalogRouter = catalogRouterBuilder.router;
