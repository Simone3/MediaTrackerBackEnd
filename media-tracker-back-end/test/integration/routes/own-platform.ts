import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { OwnPlatformInternal } from 'app/models/internal/own-platform';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestOwnPlatform, initTestUCHelper, TestUC } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extractName, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the own platforms API
 */
describe('OwnPlatform API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();

	describe('OwnPlatform API Tests', () => {

		const firstUC: TestUC = { user: '', category: '' };

		// Create new users/categories for each test
		beforeEach(async() => {

			await initTestUCHelper('MOVIE', firstUC, 'First');
		});

		it('Should create a new own platform', async() => {

			const name = randomName();
			const color = '#0000FF';

			const response = await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, {
				newOwnPlatform: {
					name: name,
					color: color
				}
			});
			
			const ownPlatformId: string = response.uid;
			expect(ownPlatformId, 'API did not return a UID').not.to.be.undefined;
			
			let foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, ownPlatformId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an undefined result').not.to.be.undefined;
			foundOwnPlatform = foundOwnPlatform as OwnPlatformInternal;
			expect(foundOwnPlatform.name, 'GetOwnPlatform returned the wrong name').to.equal(name);
			expect(foundOwnPlatform.color, 'GetOwnPlatform returned the wrong color').to.equal(color);
		});

		it('Should update an existing own platform', async() => {

			const ownPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const ownPlatformId: string = String(ownPlatform._id);
			const newName = randomName('Changed');
			const color = '#0000FF';

			await callHelper('PUT', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/${ownPlatformId}`, {
				ownPlatform: {
					name: newName,
					color: color
				}
			});
			
			let foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, ownPlatformId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an undefined result').not.to.be.undefined;
			foundOwnPlatform = foundOwnPlatform as OwnPlatformInternal;
			expect(foundOwnPlatform.name, 'GetOwnPlatform returned the wrong name').to.equal(newName);
		});

		it('Should return all user own platforms', async() => {

			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Rrr'));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Bbb'));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC, 'Zzz'));
			
			const response = await callHelper('GET', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`);
			expect(response.ownPlatforms, 'API did not return the correct number of own platforms').to.have.lengthOf(3);
			expect(response.ownPlatforms.map(extractName), 'API did not return the correct own platforms').to.eql([ 'Bbb', 'Rrr', 'Zzz' ]);
		});

		it('Should delete an existing own platform', async() => {

			const ownPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const ownPlatformId: string = String(ownPlatform._id);

			await callHelper('DELETE', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms/${ownPlatformId}`);
			
			const foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, ownPlatformId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, {
				newOwnPlatform: {
					color: '#0000FF'
				}
			}, 500);
		});

		it('Should check for color validity', async() => {

			await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/own-platforms`, {
				newOwnPlatform: {
					name: randomName(),
					color: 'sdfdcxcvxcvxcv'
				}
			}, 500);
		});
	});
});
