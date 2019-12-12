import { userController } from 'app/controllers/entities/user';
import { UserInternal } from 'app/data/models/internal/user';
import chai from 'chai';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestUser } from 'helpers/entities-builder-helper';
import { randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the user controller
 */
describe('UserController Tests', () => {
	
	setupTestDatabaseConnection();
	
	describe('UserController Tests', () => {

		it('GetUser should return the correct user after SaveUser', async() => {

			const insertedUser = await userController.saveUser(getTestUser(undefined));
			const insertedId = insertedUser._id;
			expect(insertedUser._id, 'SaveUser (insert) returned empty ID').to.exist;

			let foundUser = await userController.getUser(insertedId);
			expect(foundUser, 'GetUser returned an undefined result').not.to.be.undefined;
			foundUser = foundUser as UserInternal;
			expect(String(foundUser._id), 'GetUser returned wrong ID').to.equal(String(insertedId));
		});

		it('GetUser should return the correct user after two SaveUser (insert and update)', async() => {

			const insertedUser = await userController.saveUser(getTestUser(undefined));
			const insertedId = insertedUser._id;

			const newName = randomName('Changed');
			await userController.saveUser(getTestUser(insertedId, newName));

			let foundUser = await userController.getUser(insertedId);
			expect(foundUser, 'GetUser returned an undefined result').not.to.be.undefined;
			foundUser = foundUser as UserInternal;
			expect(String(foundUser._id), 'GetUser returned wrong ID').to.equal(String(insertedId));
			expect(foundUser.name, 'GetUser returned wrong name').to.equal(newName);
		});

		it('SaveUser (insert) should block two users with same name', async() => {

			await userController.saveUser(getTestUser(undefined, 'MyFirstName'));
			await userController.saveUser(getTestUser(undefined, 'MySecondName'));

			try {

				await userController.saveUser(getTestUser(undefined, 'MyFirstName'));
			}
			catch(error) {

				return;
			}

			throw 'SaveUser should have returned an error';
		});

		it('SaveUser (update) should block two users with same name', async() => {

			const firstUser = await userController.saveUser(getTestUser(undefined, 'MyFirstName'));
			const firstUserId = firstUser._id;
			await userController.saveUser(getTestUser(undefined, 'MySecondName'));

			try {

				await userController.saveUser(getTestUser(firstUserId, 'MySecondName'));
			}
			catch(error) {

				return;
			}

			throw 'SaveUser should have returned an error';
		});

		it('GetUser after DeleteUser should return undefined', async function() {
			
			const user = await userController.saveUser(getTestUser(undefined));
			const userId = user._id;

			await userController.deleteUser(userId);

			const foundUser = await userController.getUser(userId);
			expect(foundUser, 'GetUser returned a defined result').to.be.undefined;
		});
	});
});

