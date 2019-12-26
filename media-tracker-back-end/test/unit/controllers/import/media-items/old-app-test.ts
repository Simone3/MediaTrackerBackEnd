import { categoryController } from 'app/controllers/entities/category';
import { oldAppImportController } from 'app/controllers/import/old-app';
import { CategoryInternal } from 'app/data/models/internal/category';
import { OldAppExportImportOptionsInternal, OldAppExportInternal } from 'app/data/models/internal/import/old-app/export';
import { MediaItemInternal } from 'app/data/models/internal/media-items/media-item';
import { mediaItemFactory } from 'app/factories/media-item';
import chai from 'chai';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { initTestUHelper, TestU } from 'helpers/entities-builder-helper';
import { extract } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the old app import controller
 */
describe('OldAppImportController Tests', () => {
	
	setupTestDatabaseConnection();
	
	describe('OldAppImportController Tests', () => {

		const firstU: TestU = { user: '' };

		const helperCompareResults = (category: CategoryInternal, mediaItems: MediaItemInternal[], expectedCategoryName: string, expectedMediaItemNames: string[], expectedMediaItemPlatforms: (string | undefined)[]): void => {

			expect(category.name, 'Wrong imported category name').to.eq(expectedCategoryName);

			expect(extract(mediaItems, 'name'), 'Wrong imported media items').to.have.members(expectedMediaItemNames);

			const platforms = [];
			for(const mediaItem of mediaItems) {

				if(mediaItem.ownPlatform) {

					if(typeof mediaItem.ownPlatform === 'string') {

						platforms.push(mediaItem.ownPlatform);
					}
					else {

						platforms.push(mediaItem.ownPlatform.name);
					}
				}
				else {

					platforms.push(undefined);
				}
			}
			expect(platforms, 'Wrong imported media item own platforms').to.have.members(expectedMediaItemPlatforms);
		};

		// Create new users/categories/groups for each test
		beforeEach(async() => {

			await initTestUHelper(firstU, 'First');
		});

		it('Import should import all entities correctly', async() => {

			const oldAppExport: OldAppExportInternal = {
				categories: [{
					categoryData: {
						_id: '',
						owner: '',
						name: 'MyImportCategory1',
						color: '#ff0000',
						mediaType: 'BOOK'
					},
					mediaItems: [{
						mediaItemData: {
							_id: '',
							category: '',
							owner: '',
							name: 'MyImportMediaItem1',
							importance: '200'
						},
						owned: false
					}, {
						mediaItemData: {
							_id: '',
							category: '',
							owner: '',
							name: 'MyImportMediaItem2',
							importance: '200'
						},
						owned: true
					}]
				}, {
					categoryData: {
						_id: '',
						owner: '',
						name: 'MyImportCategory2',
						color: '#ff0000',
						mediaType: 'MOVIE'
					},
					mediaItems: [{
						mediaItemData: {
							_id: '',
							category: '',
							owner: '',
							name: 'MyImportMediaItem3',
							importance: '100'
						},
						owned: true
					}]
				}]
			};

			const importOptions: OldAppExportImportOptionsInternal = {
				defaultOwnPlatform: {
					_id: '',
					category: '',
					owner: '',
					name: 'MyDefaultOwnPlatform',
					color: '#0080ff',
					icon: 'my-icon'
				}
			};

			await oldAppImportController.import(firstU.user, oldAppExport, importOptions);

			const categories = await categoryController.getAllCategories(firstU.user);
			expect(categories, 'Wrong number of imported categories').to.have.lengthOf(2);

			let category = categories[0];
			let mediaItemController = mediaItemFactory.getEntityControllerFromCategory(category);
			let mediaItems = await mediaItemController.getAllMediaItems(firstU.user, category._id);
			helperCompareResults(category, mediaItems, 'MyImportCategory1', [ 'MyImportMediaItem1', 'MyImportMediaItem2' ], [ 'MyDefaultOwnPlatform', undefined ]);
			
			category = categories[1];
			mediaItemController = mediaItemFactory.getEntityControllerFromCategory(category);
			mediaItems = await mediaItemController.getAllMediaItems(firstU.user, category._id);
			helperCompareResults(category, mediaItems, 'MyImportCategory2', [ 'MyImportMediaItem3' ], [ 'MyDefaultOwnPlatform' ]);
		});
	});
});
