import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { IdentifiedGroup } from 'app/models/api/group';
import { IdentifiedMovie } from 'app/models/api/media-items/movie';
import { IdentifiedOwnPlatform } from 'app/models/api/own-platform';
import { MovieInternal } from 'app/models/internal/media-items/movie';
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

		// Create new users/categories/groups for each test
		beforeEach(async() => {

			await initTestUCGHelper('MOVIE', firstUCG, 'First');
		});

		it('Should create a new movie', async() => {

			const name = randomName();
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, {
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
			const movieId: string = String(movie._id);
			const newName = randomName('Changed');

			await callHelper('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/${movieId}`, {
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
			
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/filter`, {
				filter: {
					importance: 85
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
			
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/search`, {
				filter: {
					importance: 85
				},
				searchTerm: 'test'
			});
			expect(response.movies, 'API did not return the correct number of movies').to.have.lengthOf(2);
			expect(extract(response.movies, 'name'), 'API did not return the correct movies').to.have.members([ 'testAaa', 'ZzTESTz' ]);
		});

		it('Should delete an existing movie', async() => {

			const movie = await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG));
			const movieId: string = String(movie._id);

			await callHelper('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/${movieId}`);
			
			const foundMovie = await movieEntityController.getMediaItem(firstUCG.user, firstUCG.category, movieId);
			expect(foundMovie, 'GetMovie returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, {
				newMovie: {
					importance: 10
				}
			}, 500);
		});

		it('Should check for importance validity', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, {
				newMovie: {
					name: randomName()
				}
			}, 500);
		});

		it('Should search the movies catalog', async() => {

			const response = await callHelper('GET', `/catalog/movies/search/Mock Movie`);
			
			expect(response.searchResults, 'API did not return the correct number of catalog movies').to.have.lengthOf(2);
			expect(extract(response.searchResults, 'name'), 'API did not return the correct catalog movies').to.have.members([ 'Mock Movie 1', 'Mock Movie 2' ]);
			expect(extract(response.searchResults, 'catalogId'), 'API did not return the correct catalog movies').to.have.members([ '123', '456' ]);
		});

		it('Should get movie details from the catalog', async() => {

			const response = await callHelper('GET', `/catalog/movies/123`);
			
			expect(response.catalogMovie, 'API did not return a valid catalog details result').not.to.be.undefined;
			expect(response.catalogMovie.name, 'API did not return a valid catalog details result').to.be.equal('Mock Movie 1');
			expect(response.catalogMovie.directors, 'API did not return a valid catalog details result').to.be.eql([ 'Some Director' ]);
		});

		it('Should save and then retrieve ALL fields', async() => {

			// Add group
			const sourceGroup: Required<IdentifiedGroup> = {
				uid: '',
				name: randomName('Group')
			};
			const { uid: groupId } = await await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/groups`, {
				newGroup: sourceGroup
			});

			// Add own platform
			const sourceOwnPlatform: Required<IdentifiedOwnPlatform> = {
				uid: '',
				name: randomName('OwnPlatform'),
				color: '#00ff00'
			};
			const { uid: ownPlatformId } = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/own-platforms`, {
				newOwnPlatform: sourceOwnPlatform
			});

			// Add media item
			const sourceMovie: Required<IdentifiedMovie> = {
				uid: '',
				name: randomName('Name'),
				active: true,
				catalogId: randomName('Catalog'),
				completedAt: [ '2011-12-25T10:32:27.240Z', '2015-04-01T10:32:27.240Z', '2017-05-17T10:32:27.240Z' ],
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
			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`, {
				newMovie: sourceMovie
			});

			// Get media item
			const response = await callHelper('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies`);

			// "Fix" source entities
			sourceMovie.uid = response.movies[0].uid;
			sourceGroup.uid = groupId;
			sourceOwnPlatform.uid = ownPlatformId;
			sourceMovie.group.groupData = sourceGroup;
			sourceMovie.ownPlatform.ownPlatformData = sourceOwnPlatform;

			// Check media item
			expect(response.movies[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceMovie);
		});
	});
});
