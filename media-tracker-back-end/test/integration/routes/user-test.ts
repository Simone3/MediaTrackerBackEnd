import { userController } from 'app/controllers/entities/user';
import { UserInternal } from 'app/data/models/internal/user';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestUser } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the user API
 */
describe('User API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();

	describe('User API Tests', () => {

		it('Should create a new user', async() => {

			const name = randomName();
			const response = await callHelper('POST', '/users', {
				newUser: {
					name: name
				}
			});
			
			const userId: string = response.uid;
			expect(userId, 'API did not return a UID').not.to.be.undefined;
			
			let foundUser = await userController.getUser(userId);
			expect(foundUser, 'GetUser returned an undefined result').not.to.be.undefined;
			foundUser = foundUser as UserInternal;
			expect(foundUser.name, 'GetUser returned the wrong name').to.equal(name);
		});

		it('Should update an existing user', async() => {

			const user = await userController.saveUser(getTestUser(undefined));
			const userId: string = String(user._id);
			const newName = randomName('Changed');

			await callHelper('PUT', `/users/${userId}`, {
				user: {
					name: newName
				}
			});
			
			let foundUser = await userController.getUser(userId);
			expect(foundUser, 'GetUser returned an undefined result').not.to.be.undefined;
			foundUser = foundUser as UserInternal;
			expect(foundUser.name, 'GetUser returned the wrong name').to.equal(newName);
		});

		it('Should delete an existing user', async function() {

			this.timeout(4000);

			const user = await userController.saveUser(getTestUser(undefined));
			const userId: string = String(user._id);

			await callHelper('DELETE', `/users/${userId}`);
			
			const foundUser = await userController.getUser(userId);
			expect(foundUser, 'GetUser returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper('POST', '/users', {
				newUser: {}
			}, 500);
		});
	});
});
