import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { MovieInternal } from 'app/models/internal/media-items/movie';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestMovie, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extractCatalogId, extractName, extractTitle, randomName } from 'helpers/test-misc-helper';
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

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Rrr', 100));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Bbb', 85));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Zzz', 85));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Ttt', 75));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Aaa', 85));
			
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
			expect(response.movies.map(extractName), 'API did not return the correct movies').to.be.eql([ 'Zzz', 'Bbb', 'Aaa' ]);
		});

		it('Should search movies by term', async() => {

			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Rtestrr', 100));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Bbb', 85));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'ZzTESTz', 85));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'Ttt', 75));
			await movieEntityController.saveMediaItem(getTestMovie(undefined, firstUCG, 'testAaa', 85));
			
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/movies/search`, {
				filter: {
					importance: 85
				},
				searchTerm: 'test'
			});
			expect(response.movies, 'API did not return the correct number of movies').to.have.lengthOf(2);
			expect(response.movies.map(extractName), 'API did not return the correct movies').to.have.members([ 'testAaa', 'ZzTESTz' ]);
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
			expect(response.searchResults.map(extractTitle), 'API did not return the correct catalog movies').to.have.members([ 'Mock Movie 1', 'Mock Movie 2' ]);
			expect(response.searchResults.map(extractCatalogId), 'API did not return the correct catalog movies').to.have.members([ '123', '456' ]);
		});

		it('Should get movie details from the catalog', async() => {

			const response = await callHelper('GET', `/catalog/movies/123`);
			
			expect(response.catalogMovie, 'API did not return a valid catalog details result').not.to.be.undefined;
			expect(response.catalogMovie.name, 'API did not return a valid catalog details result').to.be.equal('Mock Movie 1');
			expect(response.catalogMovie.director, 'API did not return a valid catalog details result').to.be.equal('Some Director');
		});
	});
});
