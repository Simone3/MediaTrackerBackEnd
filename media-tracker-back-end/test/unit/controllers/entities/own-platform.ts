import { categoryController } from 'app/controllers/entities/category';
import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { userController } from 'app/controllers/entities/user';
import { OwnPlatformInternal } from 'app/models/internal/own-platform';
import chai from 'chai';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestOwnPlatform, initTestUCHelper, TestUC } from 'helpers/entities-builder-helper';
import { extractAsString, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the own platform controller
 */
describe('OwnPlatformController Tests', () => {
	
	setupTestDatabaseConnection();
	
	describe('OwnPlatformController Tests', () => {

		const firstUC: TestUC = { user: '', category: '' };
		const secondUC: TestUC = { user: '', category: '' };

		// Create new users/categories for each test
		beforeEach(async() => {

			await initTestUCHelper('MOVIE', firstUC, 'First');
			await initTestUCHelper('MOVIE', secondUC, 'Second');
		});
		
		it('GetOwnPlatform should return the correct own platform after SaveOwnPlatform', async() => {

			const insertedOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const insertedId = insertedOwnPlatform._id;
			expect(insertedOwnPlatform._id, 'SaveOwnPlatform (insert) returned empty ID').to.exist;

			let foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, insertedId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an undefined result').not.to.be.undefined;
			foundOwnPlatform = foundOwnPlatform as OwnPlatformInternal;
			expect(String(foundOwnPlatform._id), 'GetOwnPlatform returned wrong ID').to.equal(String(insertedId));
		});

		it('GetOwnPlatform should only get a own platform for the current user', async() => {

			let insertedOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const firstId = insertedOwnPlatform._id;
			insertedOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, secondUC));

			let foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, firstId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an undefined result').not.to.be.undefined;

			foundOwnPlatform = await ownPlatformController.getOwnPlatform(secondUC.user, firstUC.category, firstId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an defined result').to.be.undefined;
		});

		it('GetOwnPlatform should only get a own platform for the current category', async() => {

			let insertedOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const firstId = insertedOwnPlatform._id;
			insertedOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, secondUC));

			let foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, firstId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an undefined result').not.to.be.undefined;

			foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, secondUC.user, firstId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an defined result').to.be.undefined;
		});

		it('GetOwnPlatform should return the correct own platform after two SaveOwnPlatform (insert and update)', async() => {

			const insertedOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const insertedId = insertedOwnPlatform._id;

			const newName = randomName('Changed');
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(insertedId, firstUC, newName));

			let foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, insertedId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned an undefined result').not.to.be.undefined;
			foundOwnPlatform = foundOwnPlatform as OwnPlatformInternal;
			expect(String(foundOwnPlatform._id), 'GetOwnPlatform returned wrong ID').to.equal(String(insertedId));
			expect(foundOwnPlatform.name, 'GetOwnPlatform returned wrong name').to.equal(newName);
		});

		it('GetAllOwnPlatforms should return all own platforms for the given user', async() => {

			const firstUCOwnPlatforms: OwnPlatformInternal[] = [];
			const secondUCOwnPlatforms: OwnPlatformInternal[] = [];

			firstUCOwnPlatforms.push(await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC)));
			secondUCOwnPlatforms.push(await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, secondUC)));
			firstUCOwnPlatforms.push(await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC)));
			firstUCOwnPlatforms.push(await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC)));
			secondUCOwnPlatforms.push(await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, secondUC)));

			const foundFirstUCOwnPlatforms = await ownPlatformController.getAllOwnPlatforms(firstUC.user, firstUC.category);
			expect(foundFirstUCOwnPlatforms, 'GetAllOwnPlatforms did not return the correct number of results for first user').to.have.lengthOf(firstUCOwnPlatforms.length);
			expect(extractAsString(foundFirstUCOwnPlatforms, '_id'), 'GetAllOwnPlatforms did not return the correct results for first user').to.have.members(extractAsString(firstUCOwnPlatforms, '_id'));

			const foundSecondUCOwnPlatforms = await ownPlatformController.getAllOwnPlatforms(secondUC.user, secondUC.category);
			expect(foundSecondUCOwnPlatforms, 'GetAllOwnPlatforms did not return the correct number of results for second user').to.have.lengthOf(secondUCOwnPlatforms.length);
			expect(extractAsString(foundSecondUCOwnPlatforms, '_id'), 'GetAllOwnPlatforms did not return the correct results for second user').to.have.members(extractAsString(secondUCOwnPlatforms, '_id'));

			const foundWrongMatchOwnPlatforms = await ownPlatformController.getAllOwnPlatforms(firstUC.user, secondUC.category);
			expect(foundWrongMatchOwnPlatforms, 'GetAllOwnPlatforms did not return the correct number of results for non-existing user-category pair').to.have.lengthOf(0);
		});

		it('SaveOwnPlatform (insert) should not accept an invalid user', async() => {

			try {

				await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, { user: '5cbf26ea895c281b54b6737f', category: firstUC.category }));
			}
			catch(error) {

				return;
			}

			throw 'SaveOwnPlatform should have returned an error';
		});

		it('SaveOwnPlatform (update) should not accept an invalid user', async() => {

			const insertedOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const insertedId = insertedOwnPlatform._id;

			try {

				await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(insertedId, { user: '5cbf26ea895c281b54b6737f', category: firstUC.category }));
			}
			catch(error) {

				return;
			}

			throw 'SaveOwnPlatform should have returned an error';
		});

		it('SaveOwnPlatform (insert) should not accept an invalid category', async() => {

			try {

				await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, { user: firstUC.user, category: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveOwnPlatform should have returned an error';
		});

		it('SaveOwnPlatform (update) should not accept an invalid category', async() => {

			const insertedOwnPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const insertedId = insertedOwnPlatform._id;

			try {

				await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(insertedId, { user: firstUC.user, category: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveOwnPlatform should have returned an error';
		});
		
		it('GetOwnPlatform after DeleteOwnPlatform should return undefined', async() => {
			
			const ownPlatform = await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			const ownPlatformId = ownPlatform._id;

			await ownPlatformController.deleteOwnPlatform(firstUC.user, firstUC.category, ownPlatformId);

			const foundOwnPlatform = await ownPlatformController.getOwnPlatform(firstUC.user, firstUC.category, ownPlatformId);
			expect(foundOwnPlatform, 'GetOwnPlatform returned a defined result').to.be.undefined;
		});

		it('Deleting a user should also delete all its own platforms', async function() {

			this.timeout(4000);

			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));

			await userController.deleteUser(firstUC.user, true);

			const foundOwnPlatforms = await ownPlatformController.getAllOwnPlatforms(firstUC.user, firstUC.category);
			expect(foundOwnPlatforms, 'GetAllOwnPlatforms did not return the correct number of results').to.have.lengthOf(0);
		});

		it('Deleting a category should also delete all its own platforms', async function() {
			
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));
			await ownPlatformController.saveOwnPlatform(getTestOwnPlatform(undefined, firstUC));

			await categoryController.deleteCategory(firstUC.user, firstUC.category, true);

			const foundOwnPlatforms = await ownPlatformController.getAllOwnPlatforms(firstUC.user, firstUC.category);
			expect(foundOwnPlatforms, 'GetAllOwnPlatforms did not return the correct number of results').to.have.lengthOf(0);
		});
	});
});

