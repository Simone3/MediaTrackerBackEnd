import { bookCatalogController } from 'app/controllers/catalogs/media-items/book';
import { MediaItemCatalogController } from 'app/controllers/catalogs/media-items/media-item';
import { movieCatalogController } from 'app/controllers/catalogs/media-items/movie';
import { tvShowCatalogController } from 'app/controllers/catalogs/media-items/tv-show';
import { videogameCatalogController } from 'app/controllers/catalogs/media-items/videogame';
import { categoryController } from 'app/controllers/entities/category';
import { bookEntityController } from 'app/controllers/entities/media-items/book';
import { MediaItemEntityController } from 'app/controllers/entities/media-items/media-item';
import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { tvShowEntityController } from 'app/controllers/entities/media-items/tv-show';
import { videogameEntityController } from 'app/controllers/entities/media-items/videogame';
import { AppError } from 'app/models/error/error';
import { CategoryInternal, INTERNAL_MEDIA_TYPES, MediaTypeInternal } from 'app/models/internal/category';
import { CatalogMediaItemInternal, MediaItemFilterInternal, MediaItemInternal, MediaItemSortByInternal, SearchMediaItemCatalogResultInternal } from 'app/models/internal/media-items/media-item';

/**
 * Helper class to avoid multiple switch statements
 */
class ResolverHelper {

	public constructor(public entityController: EntityController, public catalogController: CatalogController) {

		// Just for parameter properties
	}
}

/**
 * Factory to get the correct media item controllers, e.g. starting from a category
 */
class MediaItemFactory {

	private listsInitialized = false;
	private readonly ENTITY_CONTROLLERS: EntityController[] = [];
	private readonly CATALOG_CONTROLLERS: CatalogController[] = [];

	/**
	 * Gets all media item entity controllers
	 * @returns an array of controllers
	 */
	public getAllEntityControllers(): EntityController[] {

		this.lazyLoadControllersLists();
		return Object.assign([], this.ENTITY_CONTROLLERS);
	}

	/**
	 * Gets all media item entity controllers
	 * @returns an array of controllers
	 */
	public getAllCatalogControllers(): CatalogController[] {

		this.lazyLoadControllersLists();
		return Object.assign([], this.CATALOG_CONTROLLERS);
	}

	/**
	 * Entity controller factory from user and category IDs
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @returns the corresponding media item controller
	 */
	public getEntityControllerFromCategoryId(userId: string, categoryId: string): Promise<EntityController> {

		return this.internalFromCategoryId(userId, categoryId, this.getEntityControllerFromMediaType.bind(this));
	}

	/**
	 * Catalog controller factory from user and category IDs
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @returns the corresponding media item controller
	 */
	public getCatalogControllerFromCategoryId(userId: string, categoryId: string): Promise<CatalogController> {

		return this.internalFromCategoryId(userId, categoryId, this.getCatalogControllerFromMediaType.bind(this));
	}

	/**
	 * Entity controller factory from category object
	 * @param category the category
	 * @returns the corresponding media item controller
	 */
	public getEntityControllerFromCategory(category: CategoryInternal): EntityController {

		return this.getEntityControllerFromMediaType(category.mediaType);
	}

	/**
	 * Catalog controller factory from category object
	 * @param category the category
	 * @returns the corresponding media item controller
	 */
	public getCatalogControllerFromCategory(category: CategoryInternal): CatalogController {

		return this.getCatalogControllerFromMediaType(category.mediaType);
	}

	/**
	 * Entity controller factory from media type enumeration
	 * @param mediaType the media type
	 * @returns the corresponding media item controller
	 */
	public getEntityControllerFromMediaType(mediaType: MediaTypeInternal): EntityController {

		return this.internalFromMediaType(mediaType).entityController;
	}

	/**
	 * Catalog controller factory from media type enumeration
	 * @param mediaType the media type
	 * @returns the corresponding media item controller
	 */
	public getCatalogControllerFromMediaType(mediaType: MediaTypeInternal): CatalogController {

		return this.internalFromMediaType(mediaType).catalogController;
	}

	/**
	 * Internal helper to retrieve a category from the database and resole its media item controller
	 */
	private internalFromCategoryId<T>(userId: string, categoryId: string, resolver: (mediaType: MediaTypeInternal) => T): Promise<T> {

		return new Promise((resolve, reject): void => {

			categoryController.getCategory(userId, categoryId)
				.then((category) => {

					if(!category) {

						reject(AppError.DATABASE_FIND.withDetails('Cannot get media item controller for a non-existing category media type'));
						return;
					}

					resolve(resolver(category.mediaType));
				})
				.catch((error) => {

					reject(error);
				});
		});
	}

	/**
	 * Internal helper to link a media type to the media item controllers
	 */
	private internalFromMediaType(mediaType: MediaTypeInternal): ResolverHelper {

		switch(mediaType) {

			case 'BOOK':
				return new ResolverHelper(bookEntityController, bookCatalogController);

			case 'TV_SHOW':
				return new ResolverHelper(tvShowEntityController, tvShowCatalogController);

			case 'VIDEOGAME':
				return new ResolverHelper(videogameEntityController, videogameCatalogController);

			case 'MOVIE':
				return new ResolverHelper(movieEntityController, movieCatalogController);

			default:
				throw AppError.GENERIC.withDetails(`Cannot resolve controllers from media type ${mediaType}`);
		}
	}

	/**
	 * Helper to lazy load the controllers lists
	 */
	private lazyLoadControllersLists(): void {

		if(!this.listsInitialized) {

			this.ENTITY_CONTROLLERS.length = 0;
			this.CATALOG_CONTROLLERS.length = 0;
	
			for(const mediaType of INTERNAL_MEDIA_TYPES) {
	
				const resolved = this.internalFromMediaType(mediaType);
				this.ENTITY_CONTROLLERS.push(resolved.entityController);
				this.CATALOG_CONTROLLERS.push(resolved.catalogController);
			}

			this.listsInitialized = true;
		}
	}
}

/**
 * Helper type alias
 */
type EntityController = MediaItemEntityController<MediaItemInternal, MediaItemSortByInternal, MediaItemFilterInternal>;

/**
 * Helper type alias
 */
type CatalogController = MediaItemCatalogController<SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal>

/**
 * The singleton instance of the media item factory
 */
export const mediaItemFactory = new MediaItemFactory();
