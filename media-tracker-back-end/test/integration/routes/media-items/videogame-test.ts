import { videogameEntityController } from 'app/controllers/entities/media-items/videogame';
import { IdentifiedGroup } from 'app/data/models/api/group';
import { CatalogVideogame, IdentifiedVideogame } from 'app/data/models/api/media-items/videogame';
import { IdentifiedOwnPlatform } from 'app/data/models/api/own-platform';
import { VideogameInternal } from 'app/data/models/internal/media-items/videogame';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestVideogame, initTestUCGHelper, TestUCG } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extract, randomName } from 'helpers/test-misc-helper';
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
			const videogameId = String(videogame._id);
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

			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'Rrr', importance: 100 }));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'Bbb', importance: 85 }));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'Zzz', importance: 85 }));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'Ttt', importance: 75 }));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'Aaa', importance: 85 }));
			
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
			expect(extract(response.videogames, 'name'), 'API did not return the correct videogames').to.be.eql([ 'Zzz', 'Bbb', 'Aaa' ]);
		});

		it('Should search videogames by term', async() => {

			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'Rtestrr', importance: 100 }));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'Bbb', importance: 85 }));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'ZzTESTz', importance: 85 }));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'Ttt', importance: 75 }));
			await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG, { name: 'testAaa', importance: 85 }));
			
			const response = await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames/search`, {
				filter: {
					importance: 85
				},
				searchTerm: 'test'
			});
			expect(response.videogames, 'API did not return the correct number of videogames').to.have.lengthOf(2);
			expect(extract(response.videogames, 'name'), 'API did not return the correct videogames').to.have.members([ 'testAaa', 'ZzTESTz' ]);
		});

		it('Should delete an existing videogame', async() => {

			const videogame = await videogameEntityController.saveMediaItem(getTestVideogame(undefined, firstUCG));
			const videogameId = String(videogame._id);

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
			expect(extract(response.searchResults, 'name'), 'API did not return the correct catalog videogames').to.have.members([ 'Mock Videogame 1', 'Mock Videogame 2' ]);
			expect(extract(response.searchResults, 'catalogId'), 'API did not return the correct catalog videogames').to.have.members([ '123', '456' ]);
		});

		it('Should get videogame details from the catalog', async() => {

			const expectedResult: Required<CatalogVideogame> = {
				name: 'Mock Videogame 1',
				description: 'The game description',
				developers: [ 'First Dev', 'Second Dev' ],
				genres: [ 'Action-Adventure', 'Role-Playing' ],
				imageUrl: 'https://www.giantbomb.com/api/image/screen_medium/2558589-w1clean.jpg',
				platforms: [ 'Mac', 'PC' ],
				publishers: [ 'Publisher1' ],
				releaseDate: '2007-10-30T00:00:00.000Z'
			};

			const response = await callHelper('GET', `/catalog/videogames/123`);
			
			expect(response.catalogVideogame, 'API did not return the correct catalog details').to.be.eql(expectedResult);
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
			const sourceVideogame: Required<IdentifiedVideogame> = {
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
				averageLengthHours: 84,
				developers: [ randomName('Developer1'), randomName('Developer2') ],
				platforms: [ randomName('Platform1'), randomName('Platform2'), randomName('Platform3') ],
				publishers: [ randomName('Publisher1') ]
			};
			await callHelper('POST', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames`, {
				newVideogame: sourceVideogame
			});

			// Get media item
			const response = await callHelper('GET', `/users/${firstUCG.user}/categories/${firstUCG.category}/videogames`);

			// "Fix" source entities
			sourceVideogame.uid = response.videogames[0].uid;
			sourceGroup.uid = groupId;
			sourceOwnPlatform.uid = ownPlatformId;
			sourceVideogame.group.groupData = sourceGroup;
			sourceVideogame.ownPlatform.ownPlatformData = sourceOwnPlatform;

			// Check media item
			expect(response.videogames[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceVideogame);
		});
	});
});
