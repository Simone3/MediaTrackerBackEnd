import { userController } from 'app/controllers/entities/user';
import { UserInternal } from 'app/models/internal/user';
import chai from 'chai';
import { randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the user controller
 */
describe('UserController Tests', () => {
	
	describe('UserController Tests', () => {

		it('GetUser should return the corrent user after SaveUser', async() => {

			const insertedUser = await userController.saveUser({ _id: undefined, name: randomName() });
			const insertedId = insertedUser._id;
			expect(insertedUser._id, 'SaveUser (insert) returned empty ID').to.exist;

			let foundUser = await userController.getUser(insertedId);
			expect(foundUser, 'GetUser returned an undefined result').not.to.be.undefined;
			foundUser = foundUser as UserInternal;
			expect(String(foundUser._id), 'GetUser returned wrong ID').to.equal(String(insertedId));
		});

		it('GetUser should return the corrent user after two SaveUser (insert and update)', async() => {

			const insertedUser = await userController.saveUser({ _id: undefined, name: randomName() });
			const insertedId = insertedUser._id;
			expect(insertedUser._id, 'SaveUser (insert) returned empty ID').to.exist;

			const newName = `Changed-${randomName()}`;
			await userController.saveUser({ _id: insertedId, name: newName });

			let foundUser = await userController.getUser(insertedId);
			expect(foundUser, 'GetUser returned an undefined result').not.to.be.undefined;
			foundUser = foundUser as UserInternal;
			expect(String(foundUser._id), 'GetUser returned wrong ID').to.equal(String(insertedId));
			expect(foundUser.name, 'GetUser returned wrong name').to.equal(newName);
		});

		it('SaveUser (insert) should block two users with same name', async() => {

			await userController.saveUser({ _id: undefined, name: 'MyFirstName' });
			await userController.saveUser({ _id: undefined, name: 'MySecondName' });

			try {

				await userController.saveUser({ _id: undefined, name: 'MyFirstName' });
			}
			catch(error) {

				return;
			}

			throw 'SaveUser should have returned an error';
		});

		it('SaveUser (update) should block two users with same name', async() => {

			const firstUser = await userController.saveUser({ _id: undefined, name: 'MyFirstName' });
			const firstUserId = firstUser._id;
			await userController.saveUser({ _id: undefined, name: 'MySecondName' });

			try {

				await userController.saveUser({ _id: firstUserId, name: 'MySecondName' });
			}
			catch(error) {

				return;
			}

			throw 'SaveUser should have returned an error';
		});

		it('GetUser after DeleteUser should return undefined', async function() {
			
			this.timeout(4000);
			
			const user = await userController.saveUser({ _id: undefined, name: randomName() });
			const userId = user._id;

			await userController.deleteUser(userId, false);

			const foundUser = await userController.getUser(userId);
			expect(foundUser, 'GetUser returned a defined result').to.be.undefined;
		});
	});
});

