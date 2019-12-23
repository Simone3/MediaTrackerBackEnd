import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { AddGroupRequest, AddGroupResponse, IdentifiedGroup } from 'app/data/models/api/group';
import { AddMediaItemResponse, DeleteMediaItemResponse, UpdateMediaItemResponse } from 'app/data/models/api/media-items/media-item';
import { AddMovieRequest, CatalogMovie, FilterMoviesRequest, FilterMoviesResponse, GetAllMoviesResponse, GetMovieFromCatalogResponse, IdentifiedMovie, SearchMovieCatalogResponse, SearchMoviesRequest, SearchMoviesResponse, UpdateMovieRequest } from 'app/data/models/api/media-items/movie';
import { AddOwnPlatformRequest, AddOwnPlatformResponse, IdentifiedOwnPlatform } from 'app/data/models/api/own-platform';
import { MovieInternal } from 'app/data/models/internal/media-items/movie';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestMovie, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extract, randomName } from 'helpers/test-misc-helper';
import { setupMovieExternalServicesMocks } from 'mocks/external-services-mocks';

const expect = chai.expect;

/**
 * Tests for the movie API
 */
describe('Movie API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();
	setupMovieExternalServicesMocks();

	describe('Movie API Tests', () => {

		const firstUCG: TestUCG = { user: '', category: '' };
		const secondUCG: TestUCG = { user: '', category: '' };

		// Create new users/categories/groups for each test
		beforeEach(async() => {

			await initTestUCGHelper('MOVIE', firstUCG, 'First');
			await initTestUCGHelper('MOVIE', secondUCG, 'Second');
		});

		it('Should create a new movie', async() => {

			const name = randomName();
			const response = await callHelper<AddMovieRequest, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: {
					name: name,
					importance: 10
				}
			});
			
			const movieId: string = response.uid;
			expect(movieId, 'API did not return a UID').not.to.be.undefined;
			
			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, movieId);
			expect(foundMovie, 'GetMovie returned an undefined result').not.to.be.undefined;
			foundMovie = foundMovie as MovieInternal;
			expect(foundMovie.name, 'GetMovie returned the wrong name').to.equal(name);
		});

		it('Should update an existing movie', async() => {

			const movie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const movieId = String(movie._id);
			const newName = randomName('Changed');

			await callHelper<UpdateMovieRequest, UpdateMediaItemResponse>('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/${movieId}`, firstUCG.user, {
				movie: {
					name: newName,
					importance: 10
				}
			});
			
			let foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, movieId);
			expect(foundMovie, 'GetMovie returned an undefined result').not.to.be.undefined;
			foundMovie = foundMovie as MovieInternal;
			expect(foundMovie.name, 'GetMovie returned the wrong name').to.equal(newName);
		});

		it('Should filter and sort movies', async() => {

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Rrr', importance: 100 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Bbb', importance: 85 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Zzz', importance: 85 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ttt', importance: 75 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Aaa', importance: 85 }));
			
			const response = await callHelper<FilterMoviesRequest, FilterMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, firstUCG.user, {
				filter: {
					importanceLevels: [ 85 ]
				},
				sortBy: [{
					field: 'NAME',
					ascending: false
				}]
			});
			expect(response.movies, 'API did not return the correct number of movies').to.have.lengthOf(3);
			expect(extract(response.movies, 'name'), 'API did not return the correct movies').to.be.eql([ 'Zzz', 'Bbb', 'Aaa' ]);
		});

		it('Should search movies by term', async() => {

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Rtestrr', importance: 100 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Bbb', importance: 85 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'ZzTESTz', importance: 85 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'Ttt', importance: 75 }));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, { name: 'testAaa', importance: 85 }));
			
			const response = await callHelper<SearchMoviesRequest, SearchMoviesResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/search`, firstUCG.user, {
				filter: {
					importanceLevels: [ 85 ]
				},
				searchTerm: 'test'
			});
			expect(response.movies, 'API did not return the correct number of movies').to.have.lengthOf(2);
			expect(extract(response.movies, 'name'), 'API did not return the correct movies').to.have.members([ 'testAaa', 'ZzTESTz' ]);
		});

		it('Should delete an existing movie', async() => {

			const movie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const movieId = String(movie._id);

			await callHelper<{}, DeleteMediaItemResponse>('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/${movieId}`, firstUCG.user);
			
			const foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, movieId);
			expect(foundMovie, 'GetMovie returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper<{}, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: {
					importance: 10
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should check for importance validity', async() => {

			await callHelper<{}, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: {
					name: randomName()
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should search the movies catalog', async() => {

			const response = await callHelper<{}, SearchMovieCatalogResponse>('GET', `/catalog/movies/search/Mock Movie`, firstUCG.user);
			
			expect(response.searchResults, 'API did not return the correct number of catalog movies').to.have.lengthOf(2);
			expect(extract(response.searchResults, 'name'), 'API did not return the correct catalog movies').to.have.members([ 'Mock Movie 1', 'Mock Movie 2' ]);
			expect(extract(response.searchResults, 'catalogId'), 'API did not return the correct catalog movies').to.have.members([ '123', '456' ]);
		});

		it('Should get movie details from the catalog', async() => {

			const expectedResult: Required<CatalogMovie> = {
				name: 'Mock Movie 1',
				description: 'Some description',
				directors: [ 'Some Director' ],
				durationMinutes: 178,
				genres: [ 'Action', 'Adventure', 'Fantasy' ],
				imageUrl: 'http://myimage.png',
				releaseDate: '2001-12-18T00:00:00.000Z'
			};

			const response = await callHelper<{}, GetMovieFromCatalogResponse>('GET', `/catalog/movies/123`, firstUCG.user);
			
			expect(response.catalogMovie, 'API did not return the correct catalog details').to.be.eql(expectedResult);
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
			const sourceMovie: Required<IdentifiedMovie> = {
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
				directors: [ randomName('Director1') ],
				durationMinutes: 525
			};
			await callHelper<AddMovieRequest, AddMediaItemResponse>('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user, {
				newMovie: sourceMovie
			});

			// Get media item
			const response = await callHelper<{}, GetAllMoviesResponse>('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, firstUCG.user);

			// "Fix" source entities
			sourceMovie.uid = response.movies[0].uid;
			sourceGroup.uid = groupId;
			sourceOwnPlatform.uid = ownPlatformId;
			sourceMovie.group.groupData = sourceGroup;
			sourceMovie.ownPlatform.ownPlatformData = sourceOwnPlatform;

			// Check media item
			expect(response.movies[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceMovie);
		});

		it('Should not allow to add to another user\'s movies', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to update another user\'s movie', async() => {

			await callHelper('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/someobjectid`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to delete another user\'s movie', async() => {

			await callHelper('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/someobjectid`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to get another user\'s movies', async() => {

			await callHelper('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to filter another user\'s movies', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to search another user\'s movies', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/search`, secondUCG.user, undefined, {
				expectedStatus: 403
			});
		});
	});
});
