import { movieEntityController } from "app/controllers/entities/media-items/movie";
import { movieCatalogController } from "app/controllers/catalogs/media-items/movie";
import { MediaItemEntityController } from "app/controllers/entities/media-items/media-item";
import { MediaItemInternal, MediaItemSortByInternal, MediaItemFilterInternal, SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal } from "app/models/internal/media-items/media-item";
import { MediaItemCatalogController } from "app/controllers/catalogs/media-items/media-item";
import { categoryController } from "app/controllers/entities/category";
import { MediaTypeInternal, CategoryInternal } from "app/models/internal/category";
import { AppError } from "app/models/error/error";
import { enumUtils } from "app/controllers/utilities/misc-utils";

type EntityController = MediaItemEntityController<MediaItemInternal, MediaItemSortByInternal, MediaItemFilterInternal>;
type CatalogController = MediaItemCatalogController<SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal>

/**
 * Factory to get the correct media item controllers, e.g. starting from a category
 */
class MediaItemFactory {

	readonly ENTITY_CONTROLLERS: EntityController[];
	readonly CATALOG_CONTROLLERS: CatalogController[];

	constructor() {

		this.ENTITY_CONTROLLERS = [];
		this.CATALOG_CONTROLLERS = [];

		for(let mediaType of enumUtils.getEnumValues(MediaTypeInternal)) {

			let resolved = this.internalFromMediaType(mediaType);
			this.ENTITY_CONTROLLERS.push(resolved.entityController);
			this.CATALOG_CONTROLLERS.push(resolved.catalogController);
		}
	}

	/**
	 * Gets all media item entity controllers
	 * @returns an array of controllers
	 */
	public getAllEntityControllers(): EntityController[] {

		return Object.assign([], this.ENTITY_CONTROLLERS);
	}

	/**
	 * Gets all media item entity controllers
	 * @returns an array of controllers
	 */
	public getAllCatalogControllers(): CatalogController[] {

		return Object.assign([], this.CATALOG_CONTROLLERS);
	}

	/**
	 * Entity controller factory from user and category IDs
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @returns the corresponding media item controller
	 */
	public getEntityControllerFromCategoryId(userId: string, categoryId: string): Promise<EntityController> {

		return this.internalFromCategoryId(userId, categoryId, this.getEntityControllerFromMediaType);
	}

	/**
	 * Catalog controller factory from user and category IDs
	 * @param userId the user ID
	 * @param categoryId the category ID
	 * @returns the corresponding media item controller
	 */
	public getCatalogControllerFromCategoryId(userId: string, categoryId: string): Promise<CatalogController> {

		return this.internalFromCategoryId(userId, categoryId, this.getCatalogControllerFromMediaType);
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

		return new Promise((resolve, reject) => {

			categoryController.getCategory(userId, categoryId)
				.then((category) => {

					if(!category) {

						reject(AppError.DATABASE_FIND.withDetails("Cannot get media item controller for a non-existing category media type"));
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

			case MediaTypeInternal.BOOK:
				// TODO

			case MediaTypeInternal.TV_SHOW:
				// TODO

			case MediaTypeInternal.VIDEOGAME:
				// TODO

			case MediaTypeInternal.MOVIE:
				return new ResolverHelper(movieEntityController, movieCatalogController);

			default:
				throw AppError.GENERIC.withDetails('Cannot resolve controllers from media type ' + mediaType);
		}
	}
}

/**
 * Helper class to avoid multiple switch statements
 */
class ResolverHelper {

	constructor(public entityController: EntityController, public catalogController: CatalogController) {}
}

/**
 * The singleton instance of the media item factory
 */
export const mediaItemFactory = new MediaItemFactory();
