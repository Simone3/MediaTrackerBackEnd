import { groupController } from 'app/controllers/entities/group';
import { GroupInternal } from 'app/models/internal/group';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestGroup, initTestUCHelper, TestUC } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extractName, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the group API
 */
describe('Group API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();

	describe('Group API Tests', () => {

		const firstUC: TestUC = { user: '', category: '' };

		// Create new users for each test
		beforeEach(async() => {

			await initTestUCHelper(firstUC, 'First');
		});

		it('Should create a new group', async() => {

			const name = randomName();
			const response = await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, {
				newGroup: {
					name: name
				}
			});
			
			const groupId: string = response.uid;
			expect(groupId, 'API did not return a UID').not.to.be.undefined;
			
			let foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, groupId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;
			foundGroup = foundGroup as GroupInternal;
			expect(foundGroup.name, 'GetGroup returned the wrong name').to.equal(name);
		});

		it('Should update an existing group', async() => {

			const group = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const groupId: string = String(group._id);
			const newName = randomName('Changed');

			await callHelper('PUT', `/users/${firstUC.user}/categories/${firstUC.category}/groups/${groupId}`, {
				group: {
					name: newName
				}
			});
			
			let foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, groupId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;
			foundGroup = foundGroup as GroupInternal;
			expect(foundGroup.name, 'GetGroup returned the wrong name').to.equal(newName);
		});

		it('Should return all user groups', async() => {

			await groupController.saveGroup(getTestGroup(undefined, firstUC, 'Rrr'));
			await groupController.saveGroup(getTestGroup(undefined, firstUC, 'Bbb'));
			await groupController.saveGroup(getTestGroup(undefined, firstUC, 'Zzz'));
			
			const response = await callHelper('GET', `/users/${firstUC.user}/categories/${firstUC.category}/groups`);
			expect(response.groups, 'API did not return the correct number of groups').to.have.lengthOf(3);
			expect(response.groups.map(extractName), 'API did not return the correct groups').to.eql([ 'Bbb', 'Rrr', 'Zzz' ]);
		});

		it('Should delete an existing group', async() => {

			const group = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const groupId: string = String(group._id);

			await callHelper('DELETE', `/users/${firstUC.user}/categories/${firstUC.category}/groups/${groupId}`);
			
			const foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, groupId);
			expect(foundGroup, 'GetGroup returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, {
				newGroup: {}
			}, 500);
		});
	});
});
