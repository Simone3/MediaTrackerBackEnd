import { videogameEntityController } from 'app/controllers/entities/media-items/videogame';
import { VideogameInternal } from 'app/models/internal/media-items/videogame';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestVideogame, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extractCatalogId, extractName, extractTitle, randomName } from 'helpers/test-misc-helper';
import { setupVideogameExternalServicesMocks } from 'mocks/external-services-mocks';

const expect = chai.expect;

/**
 * Tests for the videogame API
 */
describe('Videogame API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();
	setupVideogameExternalServicesMocks();

	describe('Videogame API Tests', () => {

		const firstUCG: TestUCG = { user: '', category: '' };

		// Create new users/categories/groups for each test
		beforeEach(async() => {

			await initTestUCGHelper('VIDEOGAME', firstUCG, 'First');
		});

		it('Should create a new videogame', async() => {

			const name = randomName();
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames`, {
				newVideogame: {
					name: name,
					importance: 10
				}
			});
			
			const videogameId: string = response.uid;
			expect(videogameId, 'API did not return a UID').not.to.be.undefined;
			
			let foundVideogame = await videogameEntityController.getMediaItem(firstUCG.user, firstUCG.category, videogameId);
			expect(foundVideogame, 'GetVideogame returned an undefined result').not.to.be.undefined;
			foundVideogame = foundVideogame as VideogameInternal;
			expect(foundVideogame.name, 'GetVideogame returned the wrong name').to.equal(name);
		});

		it('Should update an existing videogame', async() => {

			const videogame = await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG));
			const videogameId: string = String(videogame._id);
			const newName = randomName('Changed');

			await callHelper('PUT', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames/${videogameId}`, {
				videogame: {
					name: newName,
					importance: 10
				}
			});
			
			let foundVideogame = await videogameEntityController.getMediaItem(firstUCG.user, firstUCG.category, videogameId);
			expect(foundVideogame, 'GetVideogame returned an undefined result').not.to.be.undefined;
			foundVideogame = foundVideogame as VideogameInternal;
			expect(foundVideogame.name, 'GetVideogame returned the wrong name').to.equal(newName);
		});

		it('Should filter and sort videogames', async() => {

			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'Rrr', 100));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'Bbb', 85));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'Zzz', 85));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'Ttt', 75));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'Aaa', 85));
			
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames/filter`, {
				filter: {
					importance: 85
				},
				sortBy: [{
					field: 'NAME',
					ascending: false
				}]
			});
			expect(response.videogames, 'API did not return the correct number of videogames').to.have.lengthOf(3);
			expect(response.videogames.map(extractName), 'API did not return the correct videogames').to.be.eql([ 'Zzz', 'Bbb', 'Aaa' ]);
		});

		it('Should search videogames by term', async() => {

			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'Rtestrr', 100));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'Bbb', 85));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'ZzTESTz', 85));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'Ttt', 75));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, 'testAaa', 85));
			
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames/search`, {
				filter: {
					importance: 85
				},
				searchTerm: 'test'
			});
			expect(response.videogames, 'API did not return the correct number of videogames').to.have.lengthOf(2);
			expect(response.videogames.map(extractName), 'API did not return the correct videogames').to.have.members([ 'testAaa', 'ZzTESTz' ]);
		});

		it('Should delete an existing videogame', async() => {

			const videogame = await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG));
			const videogameId: string = String(videogame._id);

			await callHelper('DELETE', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames/${videogameId}`);
			
			const foundVideogame = await videogameEntityController.getMediaItem(firstUCG.user, firstUCG.category, videogameId);
			expect(foundVideogame, 'GetVideogame returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames`, {
				newVideogame: {
					importance: 10
				}
			}, 500);
		});

		it('Should check for importance validity', async() => {

			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames`, {
				newVideogame: {
					name: randomName()
				}
			}, 500);
		});

		it('Should search the videogames catalog', async() => {

			const response = await callHelper('GET', `/catalog/videogames/search/Mock Videogame`);
			
			expect(response.searchResults, 'API did not return the correct number of catalog videogames').to.have.lengthOf(2);
			expect(response.searchResults.map(extractTitle), 'API did not return the correct catalog videogames').to.have.members([ 'Mock Videogame 1', 'Mock Videogame 2' ]);
			expect(response.searchResults.map(extractCatalogId), 'API did not return the correct catalog videogames').to.have.members([ '123', '456' ]);
		});

		it('Should get videogame details from the catalog', async() => {

			const response = await callHelper('GET', `/catalog/videogames/123`);
			
			expect(response.catalogVideogame, 'API did not return a valid catalog details result').not.to.be.undefined;
			expect(response.catalogVideogame.name, 'API did not return a valid catalog details result').to.be.equal('Mock Videogame 1');
			expect(response.catalogVideogame.developer, 'API did not return a valid catalog details result').to.be.equal('First Dev, Second Dev');
		});
	});
});
