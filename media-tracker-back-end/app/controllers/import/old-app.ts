import { OldAppCategoryInternal } from 'app/data/models/internal/import/old-app/category';
import { OldAppExportImportOptionsInternal, OldAppExportInternal } from 'app/data/models/internal/import/old-app/export';
import { mediaItemFactory } from 'app/factories/media-item';
import { miscUtils } from 'app/utilities/misc-utils';
import { categoryController } from '../entities/category';
import { groupController } from '../entities/group';
import { ownPlatformController } from '../entities/own-platform';

/**
 * Controller to import old Media Tracker app exports
 */
class OldAppImportController {

	/**
	 * Imports an old Media Tracker app export with the given options, clearing every existing entity linked with the given user
	 * @param userId user ID
	 * @param oldAppExport the data from the old app export
	 * @param options the import options
	 * @returns a void promise
	 */
	public async import(userId: string, oldAppExport: OldAppExportInternal, options: OldAppExportImportOptionsInternal): Promise<void> {

		// Delete user database
		await this.clearUserEntities(userId);

		// Handle each category concurrently and then wait for all to complete
		if(oldAppExport.categories) {

			const categoriesPromises = [];
			for(const oldAppCategory of oldAppExport.categories) {

				categoriesPromises.push(this.handleCategory(userId, oldAppCategory, options));
			}
			await Promise.all(categoriesPromises);
		}
	}

	/**
	 * Helper to delete every entity linked with the given user
	 * @param userId the user
	 * @returns a promise containing the total number of deleted entities
	 */
	private clearUserEntities(userId: string): Promise<number> {

		// Delete all media item entities (with each controller)
		const mediaItemControllers = mediaItemFactory.getAllEntityControllers();
		const clearEntitiesPromises: Promise<number>[] = [];
		for(const mediaItemController of mediaItemControllers) {

			clearEntitiesPromises.push(mediaItemController.deleteAllMediaItemsForUser(userId));
		}

		// Delete categories, groups and own platforms
		clearEntitiesPromises.push(groupController.deleteAllGroupsForUser(userId));
		clearEntitiesPromises.push(ownPlatformController.deleteAllOwnPlatformsForUser(userId));
		clearEntitiesPromises.push(categoryController.deleteAllCategoriesForUser(userId));
		
		// Wait for every delete promise
		return miscUtils.mergeAndSumPromiseResults(clearEntitiesPromises);
	}

	/**
	 * Helper to handle a category import
	 * @param userId user ID
	 * @param oldAppCategory the category
	 * @param options the import options
	 */
	private async handleCategory(userId: string, oldAppCategory: OldAppCategoryInternal, options: OldAppExportImportOptionsInternal): Promise<void> {
		
		// Create the category
		const category = await categoryController.saveCategory({
			...oldAppCategory.categoryData,
			owner: userId
		}, true);
		
		// Create the default own platform (replaces the old "owned" boolean)
		const ownPlatform = await ownPlatformController.saveOwnPlatform({
			...options.defaultOwnPlatform,
			owner: userId,
			category: category._id
		}, true);
		
		// Create all media items
		if(oldAppCategory.mediaItems) {

			const mediaItemController = mediaItemFactory.getEntityControllerFromCategory(category);

			for(const oldAppMediaItem of oldAppCategory.mediaItems) {

				await mediaItemController.saveMediaItem({
					...oldAppMediaItem.mediaItemData,
					owner: userId,
					category: category._id,
					ownPlatform: oldAppMediaItem.owned ? ownPlatform._id : undefined
				}, true);
			}
		}
	}
}

/**
 * Singleton implementation of the old Media Tracker app imports controller
 */
export const oldAppImportController = new OldAppImportController();

