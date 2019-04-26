import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { userController } from 'app/controllers/entities/user';
import { GroupInternal } from 'app/models/internal/group';
import chai from 'chai';
import { setupDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestCategory, getTestGroup, getTestUser, TestUC } from 'helpers/entities-builder-helper';
import { extractId, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the group controller
 */
describe('GroupController Tests', () => {
	
	setupDatabaseConnection();
	
	describe('GroupController Tests', () => {

		const firstUC: TestUC = { user: '', category: '' };
		const secondUC: TestUC = { user: '', category: '' };
		
		const initTestUCHelper = async(target: TestUC, namePrefix: string): Promise<void> => {

			const insertedUser = await userController.saveUser(getTestUser(undefined, randomName(`${namePrefix}User`)));
			target.user = insertedUser._id;
			const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, target, randomName(`${namePrefix}Category`)));
			target.category = insertedCategory._id;
		};

		// Create new users and categories for each test
		beforeEach(async() => {

			await initTestUCHelper(firstUC, 'First');
			await initTestUCHelper(secondUC, 'Second');
		});
		
		it('GetGroup should return the correct group after SaveGroup', async() => {

			const insertedGroup = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const insertedId = insertedGroup._id;
			expect(insertedGroup._id, 'SaveGroup (insert) returned empty ID').to.exist;

			let foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, insertedId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;
			foundGroup = foundGroup as GroupInternal;
			expect(String(foundGroup._id), 'GetGroup returned wrong ID').to.equal(String(insertedId));
		});

		it('GetGroup should only get a group for the current user', async() => {

			let insertedGroup = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const firstId = insertedGroup._id;
			insertedGroup = await groupController.saveGroup(getTestGroup(undefined, secondUC));

			let foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, firstId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;

			foundGroup = await groupController.getGroup(secondUC.user, firstUC.category, firstId);
			expect(foundGroup, 'GetGroup returned an defined result').to.be.undefined;
		});

		it('GetGroup should only get a group for the current category', async() => {

			let insertedGroup = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const firstId = insertedGroup._id;
			insertedGroup = await groupController.saveGroup(getTestGroup(undefined, secondUC));

			let foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, firstId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;

			foundGroup = await groupController.getGroup(firstUC.user, secondUC.user, firstId);
			expect(foundGroup, 'GetGroup returned an defined result').to.be.undefined;
		});

		it('GetGroup should return the correct group after two SaveGroup (insert and update)', async() => {

			const insertedGroup = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const insertedId = insertedGroup._id;

			const newName = randomName('Changed');
			await groupController.saveGroup(getTestGroup(insertedId, firstUC, newName));

			let foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, insertedId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;
			foundGroup = foundGroup as GroupInternal;
			expect(String(foundGroup._id), 'GetGroup returned wrong ID').to.equal(String(insertedId));
			expect(foundGroup.name, 'GetGroup returned wrong name').to.equal(newName);
		});

		it('GetAllGroups should return all groups for the given user', async() => {

			const firstUCGroups: GroupInternal[] = [];
			const secondUCGroups: GroupInternal[] = [];

			firstUCGroups.push(await groupController.saveGroup(getTestGroup(undefined, firstUC)));
			secondUCGroups.push(await groupController.saveGroup(getTestGroup(undefined, secondUC)));
			firstUCGroups.push(await groupController.saveGroup(getTestGroup(undefined, firstUC)));
			firstUCGroups.push(await groupController.saveGroup(getTestGroup(undefined, firstUC)));
			secondUCGroups.push(await groupController.saveGroup(getTestGroup(undefined, secondUC)));

			const foundfirstUCGroups = await groupController.getAllGroups(firstUC.user, firstUC.category);
			expect(foundfirstUCGroups, 'GetAllGroups did not return the correct number of results for first user').to.have.lengthOf(firstUCGroups.length);
			expect(foundfirstUCGroups.map(extractId), 'GetAllGroups did not return the correct results for first user').to.have.members(firstUCGroups.map(extractId));

			const foundsecondUCGroups = await groupController.getAllGroups(secondUC.user, secondUC.category);
			expect(foundsecondUCGroups, 'GetAllGroups did not return the correct number of results for second user').to.have.lengthOf(secondUCGroups.length);
			expect(foundsecondUCGroups.map(extractId), 'GetAllGroups did not return the correct results for second user').to.have.members(secondUCGroups.map(extractId));

			const foundWrongMatchGroups = await groupController.getAllGroups(firstUC.user, secondUC.category);
			expect(foundWrongMatchGroups, 'GetAllGroups did not return the correct number of results for non-existing user-category pair').to.have.lengthOf(0);
		});

		it('SaveGroup (insert) should not accept an invalid user', async() => {

			try {

				await groupController.saveGroup(getTestGroup(undefined, { user: '5cbf26ea895c281b54b6737f', category: firstUC.category }));
			}
			catch(error) {

				return;
			}

			throw 'SaveGroup should have returned an error';
		});

		it('SaveGroup (update) should not accept an invalid user', async() => {

			const insertedGroup = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const insertedId = insertedGroup._id;

			try {

				await groupController.saveGroup(getTestGroup(insertedId, { user: '5cbf26ea895c281b54b6737f', category: firstUC.category }));
			}
			catch(error) {

				return;
			}

			throw 'SaveGroup should have returned an error';
		});

		it('SaveGroup (insert) should not accept an invalid category', async() => {

			try {

				await groupController.saveGroup(getTestGroup(undefined, { user: firstUC.user, category: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveGroup should have returned an error';
		});

		it('SaveGroup (update) should not accept an invalid category', async() => {

			const insertedGroup = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const insertedId = insertedGroup._id;

			try {

				await groupController.saveGroup(getTestGroup(insertedId, { user: firstUC.user, category: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveGroup should have returned an error';
		});
		
		it('GetGroup after DeleteGroup should return undefined', async() => {
			
			const group = await groupController.saveGroup(getTestGroup(undefined, firstUC));
			const groupId = group._id;

			await groupController.deleteGroup(firstUC.user, firstUC.category, groupId, false);

			const foundGroup = await groupController.getGroup(firstUC.user, firstUC.category, groupId);
			expect(foundGroup, 'GetGroup returned a defined result').to.be.undefined;
		});

		it('Deleting a user should also delete all its groups', async function() {

			this.timeout(4000);

			await groupController.saveGroup(getTestGroup(undefined, firstUC));
			await groupController.saveGroup(getTestGroup(undefined, firstUC));
			await groupController.saveGroup(getTestGroup(undefined, firstUC));

			await userController.deleteUser(firstUC.user, true);

			const foundGroups = await groupController.getAllGroups(firstUC.user, firstUC.category);
			expect(foundGroups, 'GetAllGroups did not return the correct number of results').to.have.lengthOf(0);
		});
	});
});

