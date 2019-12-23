import { tvShowEntityController } from 'app/controllers/entities/media-items/tv-show';
import { AddGroupRequest, AddGroupResponse, IdentifiedGroup } from 'app/data/models/api/group';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddTvShowRequest, CatalogTvShow, FilterTvShowsRequest, FilterTvShowsResponse, GetAllTvShowsResponse, GetTvShowFromCatalogResponse, IdentifiedTvShow, SearchTvShowCatalogResponse, SearchTvShowsRequest, SearchTvShowsResponse, UpdateTvShowRequest } from 'app/data/models/api/media-items/tv-show';
import { AddOwnPlatformRequest, AddOwnPlatformResponse, IdentifiedOwnPlatform } from 'app/data/models/api/own-platform';
import { TvShowInternal } from 'app/data/models/internal/media-items/tv-show';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestTvShow, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extract, randomName } from 'helpers/test-misc-helper';
import { setupTvShowExternalServicesMocks } from 'mocks/external-services-mocks';

const expect = chai.expect;

/**
 * Tests for the TV show API
 */
describe('TV show API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();
	setupTvShowExternalServicesMocks();

	describe('TV show API Tests', () => {

		const firstUCG: TestUCG = { user: '', category: '' };
		const secondUCG: TestUCG = { user: '', category: '' };

		// Create new users/categories/groups for each test
		beforeEach(async() => {

			await initTestUCGHelper('TV_SHOW', firstUCG, 'First');
			await initTestUCGHelper('TV_SHOW', secondUCG, 'Second');
		});

		it('Should create a new TV show', async() => {

			const name = randomName();
			const response = await callHelper<AddTvShowRequest, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows`, firstUCG.user, {
				newTvShow: {
					name: name,
					importance: 10
				}
			});
			
			const tvShowId: string = response.uid;
			expect(tvShowId, 'API did not return a UID').not.to.be.undefined;
			
			let foundTvShow = await tvShowEntityController.getMediaItem(firstUCG.user, firstUCG.category, tvShowId);
			expect(foundTvShow, 'GetTvShow returned an undefined result').not.to.be.undefined;
			foundTvShow = foundTvShow as TvShowInternal;
			expect(foundTvShow.name, 'GetTvShow returned the wrong name').to.equal(name);
		});

		it('Should update an existing TV show', async() => {

			const tvShow = await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG));
			const tvShowId = String(tvShow._id);
			const newName = randomName('Changed');

			await callHelper<UpdateTvShowRequest, UpdateMediaItemResponse>('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows/${tvShowId}`, firstUCG.user, {
				tvShow: {
					name: newName,
					importance: 10
				}
			});
			
			let foundTvShow = await tvShowEntityController.getMediaItem(firstUCG.user, firstUCG.category, tvShowId);
			expect(foundTvShow, 'GetTvShow returned an undefined result').not.to.be.undefined;
			foundTvShow = foundTvShow as TvShowInternal;
			expect(foundTvShow.name, 'GetTvShow returned the wrong name').to.equal(newName);
		});

		it('Should filter and sort TV shows', async() => {

			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'Rrr', importance: 100 }));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'Bbb', importance: 85 }));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'Zzz', importance: 85 }));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'Ttt', importance: 75 }));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'Aaa', importance: 85 }));
			
			const response = await callHelper<FilterTvShowsRequest, FilterTvShowsResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows/filter`, firstUCG.user, {
				filter: {
					importanceLevels: [ 85 ]
				},
				sortBy: [{
					field: 'NAME',
					ascending: false
				}]
			});
			expect(response.tvShows, 'API did not return the correct number of TV shows').to.have.lengthOf(3);
			expect(extract(response.tvShows, 'name'), 'API did not return the correct TV shows').to.be.eql([ 'Zzz', 'Bbb', 'Aaa' ]);
		});

		it('Should search TV shows by term', async() => {

			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'Rtestrr', importance: 100 }));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'Bbb', importance: 85 }));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'ZzTESTz', importance: 85 }));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'Ttt', importance: 75 }));
			await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG, { name: 'testAaa', importance: 85 }));
			
			const response = await callHelper<SearchTvShowsRequest, SearchTvShowsResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows/search`, firstUCG.user, {
				filter: {
					importanceLevels: [ 85 ]
				},
				searchTerm: 'test'
			});
			expect(response.tvShows, 'API did not return the correct number of TV shows').to.have.lengthOf(2);
			expect(extract(response.tvShows, 'name'), 'API did not return the correct TV shows').to.have.members([ 'testAaa', 'ZzTESTz' ]);
		});

		it('Should delete an existing TV show', async() => {

			const tvShow = await tvShowEntityController.saveMediaItem(getTestTvShow(undefined, firstUCG));
			const tvShowId = String(tvShow._id);

			await callHelper<{}, DeleteMediaItemResponse>('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows/${tvShowId}`, firstUCG.user);
			
			const foundTvShow = await tvShowEntityController.getMediaItem(firstUCG.user, firstUCG.category, tvShowId);
			expect(foundTvShow, 'GetTvShow returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper<{}, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows`, firstUCG.user, {
				newTvShow: {
					importance: 10
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should check for importance validity', async() => {

			await callHelper<{}, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows`, firstUCG.user, {
				newTvShow: {
					name: randomName()
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should search the TV shows catalog', async() => {

			const response = await callHelper<{}, SearchTvShowCatalogResponse>('GET', `/catalog/tv-shows/search/Mock TV Show`, firstUCG.user);
			
			expect(response.searchResults, 'API did not return the correct number of catalog TV shows').to.have.lengthOf(2);
			expect(extract(response.searchResults, 'name'), 'API did not return the correct catalog TV shows').to.have.members([ 'Mock TV Show 1', 'Mock TV Show 2' ]);
			expect(extract(response.searchResults, 'catalogId'), 'API did not return the correct catalog TV shows').to.have.members([ '123', '456' ]);
		});

		it('Should get TV show details from the catalog', async() => {
			
			const expectedResult: Required<CatalogTvShow> = {
				name: 'Mock TV Show 1',
				description: 'This is the description!',
				averageEpisodeRuntimeMinutes: 60,
				creators: [ 'First Creator', 'Second Creator' ],
				episodesNumber: 73,
				genres: [ 'Action & Adventure', 'Drama', 'Sci-Fi & Fantasy' ],
				imageUrl: '/qsD5OHqW7DSnaQ2afwz8Ptht1Xb.jpg',
				inProduction: true,
				nextEpisodeAirDate: '2090-05-19T00:00:00.000Z',
				releaseDate: '2011-04-17T00:00:00.000Z',
				seasonsNumber: 8
			};

			const response = await callHelper<{}, GetTvShowFromCatalogResponse>('GET', `/catalog/tv-shows/123`, firstUCG.user);
			
			expect(response.catalogTvShow, 'API did not return the correct catalog details').to.be.eql(expectedResult);
		});

		it('Should save and then retrieve ALL fields', async() => {

			// Add group
			const sourceGroup: Required<IdentifiedGroup> = {
				uid: '',
				name: randomName('Group')
			};
			const { uid: groupId } = await await callHelper<AddGroupRequest, AddGroupResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/groups`, firstUCG.user, {
				newGroup: sourceGroup
			});

			// Add own platform
			const sourceOwnPlatform: Required<IdentifiedOwnPlatform> = {
				uid: '',
				name: randomName('OwnPlatform'),
				color: '#00ff00',
				icon: 'something'
			};
			const { uid: ownPlatformId } = await callHelper<AddOwnPlatformRequest, AddOwnPlatformResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/own-platforms`, firstUCG.user, {
				newOwnPlatform: sourceOwnPlatform
			});

			// Add media item
			const sourceTvShow: Required<IdentifiedTvShow> = {
				uid: '',
				name: randomName('Name'),
				active: true,
				markedAsRedo: true,
				catalogId: randomName('Catalog'),
				completedOn: [ '2011-12-25T10:32:27.240Z', '2015-04-01T10:32:27.240Z', '2017-05-17T10:32:27.240Z' ],
				description: randomName('Description'),
				genres: [ randomName('Genre1') ],
				group: {
					groupId: groupId,
					orderInGroup: 4
				},
				imageUrl: 'http://test.com',
				importance: 56,
				ownPlatform: {
					ownPlatformId: ownPlatformId
				},
				releaseDate: '2010-01-01T10:32:27.240Z',
				userComment: randomName('SomeComment'),
				averageEpisodeRuntimeMinutes: 61,
				creators: [ randomName('Creator1'), randomName('Creator2') ],
				episodesNumber: 56,
				inProduction: true,
				nextEpisodeAirDate: '2018-02-28T10:32:27.240Z',
				seasonsNumber: 2
			};
			await callHelper<AddTvShowRequest, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows`, firstUCG.user, {
				newTvShow: sourceTvShow
			});

			// Get media item
			const response = await callHelper<{}, GetAllTvShowsResponse>('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows`, firstUCG.user);

			// "Fix" source entities
			sourceTvShow.uid = response.tvShows[0].uid;
			sourceGroup.uid = groupId;
			sourceOwnPlatform.uid = ownPlatformId;
			sourceTvShow.group.groupData = sourceGroup;
			sourceTvShow.ownPlatform.ownPlatformData = sourceOwnPlatform;

			// Check media item
			expect(response.tvShows[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceTvShow);
		});

		it('Should not allow to add to another user\'s TV shows', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to update another user\'s TV show', async() => {

			await callHelper('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows/someobjectid`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to delete another user\'s TV show', async() => {

			await callHelper('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows/someobjectid`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to get another user\'s TV shows', async() => {

			await callHelper('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to filter another user\'s TV shows', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows/filter`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to search another user\'s TV shows', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/tv-shows/search`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});
	});
});
