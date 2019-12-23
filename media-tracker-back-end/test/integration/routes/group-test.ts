import { groupController } from 'app/controllers/entities/group';
import { AddGroupRequest, AddGroupResponse, DeleteGroupResponse, FilterGroupsRequest, FilterGroupsResponse, GetAllGroupsResponse, IdentifiedGroup, UpdateGroupRequest, UpdateGroupResponse } from 'app/data/models/api/group';
import { GroupInternal } from 'app/data/models/internal/group';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestGroup, initTestUCHelper, TestUC } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extract, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the group API
 */
describe('Group API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();

	describe('Group API Tests', () => {

		const firstUC: TestUC = { user: '', category: '' };
		const secondUC: TestUC = { user: '', category: '' };

		// Create new users/categories for each test
		beforeEach(async() => {

			await initTestUCHelper('MOVIE', firstUC, 'First');
			await initTestUCHelper('MOVIE', secondUC, 'Second');
		});

		it('Should create a new group', async() => {

			const name = randomName();
			const response = await callHelper<AddGroupRequest, AddGroupResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, firstUC.user, {
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
			const groupId = String(group._id);
			const newName = randomName('Changed');

			await callHelper<UpdateGroupRequest, UpdateGroupResponse>('PUT', `/users/${firstUC.user}/categories/${firstUC.category}/groups/${groupId}`, firstUC.user, {
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
			
			const response = await callHelper<{}, GetAllGroupsResponse>('GET', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, firstUC.user);
			expect(response.groups, 'API did not return the correct number of groups').to.have.lengthOf(3);
			expect(extract(response.groups, 'name'), 'API did not return the correct groups').to.eql([ 'Bbb', 'Rrr', 'Zzz' ]);
		});

		it('Should return all user groups that match the filter', async() => {

			await groupController.saveGroup(getTestGroup(undefined, firstUC, 'Rrr'));
			await groupController.saveGroup(getTestGroup(undefined, firstUC, 'Bbb'));
			await groupController.saveGroup(getTestGroup(undefined, firstUC, 'Zzz'));
			
			const response = await callHelper<FilterGroupsRequest, FilterGroupsResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/groups/filter`, firstUC.user, {
				filter: {
					name: 'bbB'
				}
			});
			expect(response.groups, 'API did not return the correct number of groups').to.have.lengthOf(1);
			expect(extract(response.groups, 'name'), 'API did not return the correct groups').to.eql([ 'Bbb' ]);
		});

		it('Should delete an existing group', async() => {

			const group = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const groupId = String(group._id);

			await callHelper<{}, DeleteGroupResponse>('DELETE', `/users/${firstUC.user}/categories/${firstUC.category}/groups/${groupId}`, firstUC.user);
			
			const foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, groupId);
			expect(foundGroup, 'GetGroup returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper<{}, AddGroupResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, firstUC.user, {
				newGroup: {}
			}, {
				expectedStatus: 500
			});
		});

		it('Should save and then retrieve ALL fields', async() => {

			const sourceGroup: Required<IdentifiedGroup> = {
				uid: '',
				name: randomName()
			};

			await await callHelper<AddGroupRequest, AddGroupResponse>('POST', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, firstUC.user, {
				newGroup: sourceGroup
			});

			const response = await callHelper<{}, GetAllGroupsResponse>('GET', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, firstUC.user);

			sourceGroup.uid = response.groups[0].uid;
			expect(response.groups[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceGroup);
		});

		it('Should not allow to add to another user\'s groups', async() => {

			await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to update another user\'s group', async() => {

			await callHelper('PUT', `/users/${firstUC.user}/categories/${firstUC.category}/groups/someobjectid`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to delete another user\'s group', async() => {

			await callHelper('DELETE', `/users/${firstUC.user}/categories/${firstUC.category}/groups/someobjectid`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to get another user\'s groups', async() => {

			await callHelper('GET', `/users/${firstUC.user}/categories/${firstUC.category}/groups`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to filter another user\'s groups', async() => {

			await callHelper('POST', `/users/${firstUC.user}/categories/${firstUC.category}/groups/filter`, secondUC.user, undefined, {
				expectedStatus: 403
			});
		});
	});
});
