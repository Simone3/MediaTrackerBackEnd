import { categoryController } from 'app/controllers/entities/category';
import { OldAppCategory } from 'app/data/models/api/import/old-app/category';
import { ImportOldAppExportRequest, ImportOldAppExportResponse } from 'app/data/models/api/import/old-app/export';
import { OldAppMediaItem } from 'app/data/models/api/import/old-app/media-item';
import { CategoryInternal, MediaTypeInternal } from 'app/data/models/internal/category';
import { GroupInternal } from 'app/data/models/internal/group';
import { OwnPlatformInternal } from 'app/data/models/internal/own-platform';
import { mediaItemFactory } from 'app/factories/media-item';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { initTestUHelper, TestU } from 'helpers/entities-builder-helper';
import { ExpectedBookInternal, ExpectedCategoryInternal, ExpectedMediaItemInternal, ExpectedMovieInternal, ExpectedTvShowInternal, ExpectedVideogameInternal } from 'helpers/entities-comparison-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { compareExpectedFields } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the old app import API
 */
describe('Old App Import API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();

	describe('Old App Import Tests', () => {

		const firstU: TestU = { user: '' };
		const secondU: TestU = { user: '' };

		// Create new users for each test
		beforeEach(async() => {

			await initTestUHelper(firstU, 'First');
			await initTestUHelper(secondU, 'Second');
		});

		const helperCheckResults = async(categories: CategoryInternal[], mediaType: MediaTypeInternal, expectedCategory: ExpectedCategoryInternal, expectedMediaItem: ExpectedMediaItemInternal): Promise<void> => {
			
			const mediaTypeCategories = categories.filter((listCategory) => {
				return listCategory.mediaType === mediaType;
			});
			expect(mediaTypeCategories, `Wrong number of imported categories (per media type) for ${mediaType}`).to.have.lengthOf(1);
			compareExpectedFields(mediaTypeCategories[0], expectedCategory, `Wrong imported category for ${mediaType}`);
			
			const mediaItemController = mediaItemFactory.getEntityControllerFromCategory(mediaTypeCategories[0]);
			const mediaItems = await mediaItemController.getAllMediaItems(firstU.user, mediaTypeCategories[0]._id);
			expect(mediaItems, `Wrong number of imported media items for ${mediaType}`).to.have.lengthOf(1);
			compareExpectedFields(mediaItems[0], expectedMediaItem, `Wrong imported media item for ${mediaType}`);
		};

		it('Should import ALL fields', async() => {

			const todayMidnight = new Date();
			todayMidnight.setHours(0, 0, 0, 0);

			const book: Required<OldAppMediaItem> = {
				NAME: 'MyBook',
				GENRES: 'MyGenre1, MyGenre2, MyGenre3',
				DESCRIPTION: 'Some description',
				USER_COMMENT: 'Some comment',
				COMPLETION_DATE: '1577208205000',
				TIMES_COMPLETED: '3',
				IMPORTANCE_LEVEL: 'MEDIUM',
				OWNED: '0',
				RELEASE_DATE: '1008630000000',
				DOING_NOW: '0',
				EXTERNAL_SERVICE_ID: '123456',
				IMAGE: 'http://some.image.com',
				ORDER_IN_SECTION: '500',
				PAGES_NUMBER: '112233',
				AUTHOR: 'Person1, Person2',
				DURATION_MIN: '',
				DIRECTOR: '',
				EPISODE_RUNTIME_MIN: '',
				CREATED_BY: '',
				EPISODES_NUMBER: '',
				SEASONS_NUMBER: '',
				IN_PRODUCTION: '0',
				NEXT_EPISODE_AIR_DATE: '',
				DEVELOPER: '',
				PUBLISHER: '',
				PLATFORMS: '',
				AVERAGE_LENGTH_HOURS: ''
			};

			const expectedBook: Required<ExpectedBookInternal> = {
				name: 'MyBook',
				genres: [ 'MyGenre1', 'MyGenre2', 'MyGenre3' ],
				description: 'Some description',
				userComment: 'Some comment',
				completedOn: [ new Date('2019-12-24T17:23:25.000Z'), new Date('2019-12-24T17:23:25.000Z'), new Date('2019-12-24T17:23:25.000Z') ],
				completedLastOn: new Date('2019-12-24T17:23:25.000Z'),
				importance: '300',
				ownPlatform: undefined as unknown as OwnPlatformInternal,
				group: undefined as unknown as GroupInternal,
				orderInGroup: undefined as unknown as number,
				releaseDate: new Date('2001-12-17T23:00:00.000Z'),
				active: false,
				catalogId: '123456',
				imageUrl: 'http://some.image.com',
				markedAsRedo: false,
				pagesNumber: 112233,
				authors: [ 'Person1', 'Person2' ]
			};
			
			const bookCategory: Required<OldAppCategory> = {
				NAME: 'MyBookCategory',
				COLOR_RESOURCE_NAME: 'blue',
				MEDIA_TYPE_NAME: 'BOOKS',
				MEDIA_ITEMS: [ book ]
			};

			const expectedBookCategory: Required<ExpectedCategoryInternal> = {
				name: 'MyBookCategory',
				mediaType: 'BOOK',
				color: '#3c82eb'
			};

			const movie: Required<OldAppMediaItem> = {
				NAME: 'MyMovie',
				GENRES: 'MyGenre1, MyGenre2',
				DESCRIPTION: 'Some description',
				USER_COMMENT: 'Some comment',
				COMPLETION_DATE: '1577208205000',
				TIMES_COMPLETED: '1',
				IMPORTANCE_LEVEL: 'MEDIUM',
				OWNED: '0',
				RELEASE_DATE: '1008630000000',
				DOING_NOW: '1',
				EXTERNAL_SERVICE_ID: '123456',
				IMAGE: 'http://some.image.com',
				ORDER_IN_SECTION: '500',
				PAGES_NUMBER: '',
				AUTHOR: '',
				DURATION_MIN: '150',
				DIRECTOR: 'Someone 1, Someone 2',
				EPISODE_RUNTIME_MIN: '',
				CREATED_BY: '',
				EPISODES_NUMBER: '',
				SEASONS_NUMBER: '',
				IN_PRODUCTION: '0',
				NEXT_EPISODE_AIR_DATE: '',
				DEVELOPER: '',
				PUBLISHER: '',
				PLATFORMS: '',
				AVERAGE_LENGTH_HOURS: ''
			};

			const expectedMovie: Required<ExpectedMovieInternal> = {
				name: 'MyMovie',
				genres: [ 'MyGenre1', 'MyGenre2' ],
				description: 'Some description',
				userComment: 'Some comment',
				completedOn: [ new Date('2019-12-24T17:23:25.000Z') ],
				completedLastOn: new Date('2019-12-24T17:23:25.000Z'),
				importance: '300',
				ownPlatform: undefined as unknown as OwnPlatformInternal,
				group: undefined as unknown as GroupInternal,
				orderInGroup: undefined as unknown as number,
				releaseDate: new Date('2001-12-17T23:00:00.000Z'),
				active: true,
				catalogId: '123456',
				imageUrl: 'http://some.image.com',
				markedAsRedo: false,
				durationMinutes: 150,
				directors: [ 'Someone 1', 'Someone 2' ]
			};
			
			const movieCategory: Required<OldAppCategory> = {
				NAME: 'MyMovieCategory',
				COLOR_RESOURCE_NAME: 'blue',
				MEDIA_TYPE_NAME: 'MOVIES',
				MEDIA_ITEMS: [ movie ]
			};

			const expectedMovieCategory: Required<ExpectedCategoryInternal> = {
				name: 'MyMovieCategory',
				mediaType: 'MOVIE',
				color: '#3c82eb'
			};

			const tvShow: Required<OldAppMediaItem> = {
				NAME: 'MyTvShow',
				GENRES: 'MyGenre1',
				DESCRIPTION: 'Some description',
				USER_COMMENT: 'Some comment',
				COMPLETION_DATE: '',
				TIMES_COMPLETED: '3',
				IMPORTANCE_LEVEL: 'HIGH',
				OWNED: '0',
				RELEASE_DATE: '1008630000000',
				DOING_NOW: '0',
				EXTERNAL_SERVICE_ID: '123456',
				IMAGE: 'http://some.image.com',
				ORDER_IN_SECTION: '500',
				PAGES_NUMBER: '',
				AUTHOR: '',
				DURATION_MIN: '',
				DIRECTOR: '',
				EPISODE_RUNTIME_MIN: '43',
				CREATED_BY: 'Creator',
				EPISODES_NUMBER: '22',
				SEASONS_NUMBER: '11',
				IN_PRODUCTION: '1',
				NEXT_EPISODE_AIR_DATE: '1546729200000',
				DEVELOPER: '',
				PUBLISHER: '',
				PLATFORMS: '',
				AVERAGE_LENGTH_HOURS: ''
			};

			const expectedTvShow: Required<ExpectedTvShowInternal> = {
				name: 'MyTvShow',
				genres: [ 'MyGenre1' ],
				description: 'Some description',
				userComment: 'Some comment',
				completedOn: [ todayMidnight, todayMidnight, todayMidnight ],
				completedLastOn: todayMidnight,
				importance: '400',
				ownPlatform: undefined as unknown as OwnPlatformInternal,
				group: undefined as unknown as GroupInternal,
				orderInGroup: undefined as unknown as number,
				releaseDate: new Date('2001-12-17T23:00:00.000Z'),
				active: false,
				catalogId: '123456',
				imageUrl: 'http://some.image.com',
				markedAsRedo: true,
				averageEpisodeRuntimeMinutes: 43,
				creators: [ 'Creator' ],
				seasons: [],
				inProduction: true,
				nextEpisodeAirDate: new Date('2019-01-05T23:00:00.000Z')
			};
			
			const tvShowCategory: Required<OldAppCategory> = {
				NAME: 'MyTvShowCategory',
				COLOR_RESOURCE_NAME: 'blue',
				MEDIA_TYPE_NAME: 'TV_SHOWS',
				MEDIA_ITEMS: [ tvShow ]
			};

			const expectedTvShowCategory: Required<ExpectedCategoryInternal> = {
				name: 'MyTvShowCategory',
				mediaType: 'TV_SHOW',
				color: '#3c82eb'
			};
			const videogame: Required<OldAppMediaItem> = {
				NAME: 'MyVideogame',
				GENRES: 'MyGenre1, MyGenre2',
				DESCRIPTION: 'Some description',
				USER_COMMENT: 'Some comment',
				COMPLETION_DATE: '',
				TIMES_COMPLETED: '',
				IMPORTANCE_LEVEL: 'MEDIUM',
				OWNED: '0',
				RELEASE_DATE: '1008630000000',
				DOING_NOW: '1',
				EXTERNAL_SERVICE_ID: '123456',
				IMAGE: 'http://some.image.com',
				ORDER_IN_SECTION: '500',
				PAGES_NUMBER: '',
				AUTHOR: '',
				DURATION_MIN: '',
				DIRECTOR: '',
				EPISODE_RUNTIME_MIN: '',
				CREATED_BY: '',
				EPISODES_NUMBER: '',
				SEASONS_NUMBER: '',
				IN_PRODUCTION: '0',
				NEXT_EPISODE_AIR_DATE: '',
				DEVELOPER: 'One, Two, Three',
				PUBLISHER: 'Four',
				PLATFORMS: 'Five, Six',
				AVERAGE_LENGTH_HOURS: '147'
			};

			const expectedVideogame: Required<ExpectedVideogameInternal> = {
				name: 'MyVideogame',
				genres: [ 'MyGenre1', 'MyGenre2' ],
				description: 'Some description',
				userComment: 'Some comment',
				completedOn: [],
				completedLastOn: undefined as unknown as Date,
				importance: '300',
				ownPlatform: undefined as unknown as OwnPlatformInternal,
				group: undefined as unknown as GroupInternal,
				orderInGroup: undefined as unknown as number,
				releaseDate: new Date('2001-12-17T23:00:00.000Z'),
				active: true,
				catalogId: '123456',
				imageUrl: 'http://some.image.com',
				markedAsRedo: false,
				developers: [ 'One', 'Two', 'Three' ],
				publishers: [ 'Four' ],
				platforms: [ 'Five', 'Six' ],
				averageLengthHours: 147
			};
			
			const videogameCategory: Required<OldAppCategory> = {
				NAME: 'MyVideogameCategory',
				COLOR_RESOURCE_NAME: 'blue',
				MEDIA_TYPE_NAME: 'VIDEOGAMES',
				MEDIA_ITEMS: [ videogame ]
			};

			const expectedVideogameCategory: Required<ExpectedCategoryInternal> = {
				name: 'MyVideogameCategory',
				mediaType: 'VIDEOGAME',
				color: '#3c82eb'
			};

			await callHelper<ImportOldAppExportRequest, ImportOldAppExportResponse>('POST', `/users/${firstU.user}/import/old-app`, firstU.user, {
				export: {
					CATEGORIES: [
						bookCategory,
						movieCategory,
						tvShowCategory,
						videogameCategory
					]
				},
				options: {
					defaultOwnPlatform: {
						name: 'aaa',
						color: '#aaaaaa',
						icon: 'aaa'
					}
				}
			});

			const categories = await categoryController.getAllCategories(firstU.user);
			expect(categories, 'Wrong number of imported categories').to.have.lengthOf(4);

			await helperCheckResults(categories, 'BOOK', expectedBookCategory, expectedBook);
			await helperCheckResults(categories, 'MOVIE', expectedMovieCategory, expectedMovie);
			await helperCheckResults(categories, 'TV_SHOW', expectedTvShowCategory, expectedTvShow);
			await helperCheckResults(categories, 'VIDEOGAME', expectedVideogameCategory, expectedVideogame);
		});

		it('Should not allow to import to another user\'s database', async() => {

			await callHelper('POST', `/users/${firstU.user}/import/old-app`, secondU.user, undefined, {
				expectedStatus: 403
			});
		});
	});
});
