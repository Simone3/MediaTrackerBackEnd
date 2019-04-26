import { categoryController } from 'app/controllers/entities/category';
import { groupController } from 'app/controllers/entities/group';
import { userController } from 'app/controllers/entities/user';
import { GroupInternal } from 'app/models/internal/group';
import chai from 'chai';
import { extractId, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the group controller
 */
describe('GroupController Tests', () => {
	
	describe('GroupController Tests', () => {

		let firstUser: string;
		let firstCategory: string;
		let secondUser: string;
		let secondCategory: string;
		
		// Create a user for each test
		beforeEach(async() => {

			let insertedUser = await userController.saveUser({ _id: undefined, name: randomName('FirstUse') });
			firstUser = insertedUser._id;
			let insertedCategory = await categoryController.saveCategory({ _id: undefined, mediaType: 'MOVIE', owner: firstUser, name: randomName('FirstCat') });
			firstCategory = insertedCategory._id;

			insertedUser = await userController.saveUser({ _id: undefined, name: randomName('SecondUse') });
			secondUser = insertedUser._id;
			insertedCategory = await categoryController.saveCategory({ _id: undefined, mediaType: 'MOVIE', owner: secondUser, name: randomName('SecondCat') });
			secondCategory = insertedCategory._id;
		});

		const buildGroup = (_id: unknown, name: string, user?: string, category?: string): GroupInternal => {
			
			return {
				_id: _id,
				owner: user ? user : firstUser,
				category: category ? category : firstCategory,
				name: name
			};
		};

		it('GetGroup should return the correct group after SaveGroup', async() => {

			const insertedGroup = await groupController.saveGroup(buildGroup(undefined, randomName()));
			const insertedId = insertedGroup._id;
			expect(insertedGroup._id, 'SaveGroup (insert) returned empty ID').to.exist;

			let foundGroup = await groupController.getGroup(firstUser, firstCategory, insertedId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;
			foundGroup = foundGroup as GroupInternal;
			expect(String(foundGroup._id), 'GetGroup returned wrong ID').to.equal(String(insertedId));
		});

		it('GetGroup should only get a group for the current user', async() => {

			let insertedGroup = await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory));
			const firstId = insertedGroup._id;
			insertedGroup = await groupController.saveGroup(buildGroup(undefined, randomName(), secondUser, secondCategory));

			let foundGroup = await groupController.getGroup(firstUser, firstCategory, firstId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;

			foundGroup = await groupController.getGroup(secondUser, firstCategory, firstId);
			expect(foundGroup, 'GetGroup returned an defined result').to.be.undefined;
		});

		it('GetGroup should only get a group for the current category', async() => {

			let insertedGroup = await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory));
			const firstId = insertedGroup._id;
			insertedGroup = await groupController.saveGroup(buildGroup(undefined, randomName(), secondUser, secondCategory));

			let foundGroup = await groupController.getGroup(firstUser, firstCategory, firstId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;

			foundGroup = await groupController.getGroup(firstUser, secondUser, firstId);
			expect(foundGroup, 'GetGroup returned an defined result').to.be.undefined;
		});

		it('GetGroup should return the correct group after two SaveGroup (insert and update)', async() => {

			const insertedGroup = await groupController.saveGroup(buildGroup(undefined, randomName()));
			const insertedId = insertedGroup._id;

			const newName = randomName('Changed');
			await groupController.saveGroup(buildGroup(insertedId, newName));

			let foundGroup = await groupController.getGroup(firstUser, firstCategory, insertedId);
			expect(foundGroup, 'GetGroup returned an undefined result').not.to.be.undefined;
			foundGroup = foundGroup as GroupInternal;
			expect(String(foundGroup._id), 'GetGroup returned wrong ID').to.equal(String(insertedId));
			expect(foundGroup.name, 'GetGroup returned wrong name').to.equal(newName);
		});

		it('GetAllGroups should return all groups for the given user', async() => {

			const firstUserGroups: GroupInternal[] = [];
			const secondUserGroups: GroupInternal[] = [];

			firstUserGroups.push(await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory)));
			secondUserGroups.push(await groupController.saveGroup(buildGroup(undefined, randomName(), secondUser, secondCategory)));
			firstUserGroups.push(await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory)));
			firstUserGroups.push(await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory)));
			secondUserGroups.push(await groupController.saveGroup(buildGroup(undefined, randomName(), secondUser, secondCategory)));

			const foundFirstUserGroups = await groupController.getAllGroups(firstUser, firstCategory);
			expect(foundFirstUserGroups, 'GetAllGroups did not return the correct number of results for first user').to.have.lengthOf(firstUserGroups.length);
			expect(foundFirstUserGroups.map(extractId), 'GetAllGroups did not return the correct results for first user').to.have.members(firstUserGroups.map(extractId));

			const foundSecondUserGroups = await groupController.getAllGroups(secondUser, secondCategory);
			expect(foundSecondUserGroups, 'GetAllGroups did not return the correct number of results for second user').to.have.lengthOf(secondUserGroups.length);
			expect(foundSecondUserGroups.map(extractId), 'GetAllGroups did not return the correct results for second user').to.have.members(secondUserGroups.map(extractId));

			const foundWrongMatchGroups = await groupController.getAllGroups(firstUser, secondCategory);
			expect(foundWrongMatchGroups, 'GetAllGroups did not return the correct number of results for non-existing user-category pair').to.have.lengthOf(0);
		});

		it('SaveGroup (insert) should not accept an invalid user', async() => {

			try {

				await groupController.saveGroup(buildGroup(undefined, randomName(), '5cbf26ea895c281b54b6737f', firstCategory));
			}
			catch(error) {

				return;
			}

			throw 'SaveGroup should have returned an error';
		});

		it('SaveGroup (update) should not accept an invalid user', async() => {

			const insertedGroup = await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory));
			const insertedId = insertedGroup._id;

			try {

				await groupController.saveGroup(buildGroup(insertedId, randomName(), '5cbf26ea895c281b54b6737f', firstCategory));
			}
			catch(error) {

				return;
			}

			throw 'SaveGroup should have returned an error';
		});

		it('SaveGroup (insert) should not accept an invalid category', async() => {

			try {

				await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, '5cbf26ea895c281b54b6737f'));
			}
			catch(error) {

				return;
			}

			throw 'SaveGroup should have returned an error';
		});

		it('SaveGroup (update) should not accept an invalid category', async() => {

			const insertedGroup = await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory));
			const insertedId = insertedGroup._id;

			try {

				await groupController.saveGroup(buildGroup(insertedId, randomName(), firstUser, '5cbf26ea895c281b54b6737f'));
			}
			catch(error) {

				return;
			}

			throw 'SaveGroup should have returned an error';
		});
		
		it('GetGroup after DeleteGroup should return undefined', async() => {
			
			const group = await groupController.saveGroup(buildGroup(undefined, randomName()));
			const groupId = group._id;

			await groupController.deleteGroup(firstUser, firstCategory, groupId, false);

			const foundGroup = await groupController.getGroup(firstUser, firstCategory, groupId);
			expect(foundGroup, 'GetGroup returned a defined result').to.be.undefined;
		});

		it('Deleting a user should also delete all its groups', async function() {

			this.timeout(4000);

			await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory));
			await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory));
			await groupController.saveGroup(buildGroup(undefined, randomName(), firstUser, firstCategory));

			await userController.deleteUser(firstUser, true);

			const foundGroups = await groupController.getAllGroups(firstUser, firstCategory);
			expect(foundGroups, 'GetAllGroups did not return the correct number of results').to.have.lengthOf(0);
		});
	});
});

