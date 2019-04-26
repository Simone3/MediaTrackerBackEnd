import { categoryController } from 'app/controllers/entities/category';
import { userController } from 'app/controllers/entities/user';
import { CategoryInternal } from 'app/models/internal/category';
import chai from 'chai';
import { getTestCategory, getTestUser, TestU } from 'helpers/entities-builder-helper';
import { extractId, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the category controller
 */
describe('CategoryController Tests', () => {
	
	describe('CategoryController Tests', () => {

		const firstU: TestU = { user: '' };
		const secondU: TestU = { user: '' };
		
		const initTestUHelper = async(target: TestU, namePrefix: string): Promise<void> => {

			const insertedUser = await userController.saveUser(getTestUser(undefined, randomName(`${namePrefix}User`)));
			target.user = insertedUser._id;
		};

		// Create new users for each test
		beforeEach(async() => {

			await initTestUHelper(firstU, 'First');
			await initTestUHelper(secondU, 'Second');
		});

		it('GetCategory should return the correct category after SaveCategory', async() => {

			const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, firstU));
			const insertedId = insertedCategory._id;
			expect(insertedCategory._id, 'SaveCategory (insert) returned empty ID').to.exist;

			let foundCategory = await categoryController.getCategory(firstU.user, insertedId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(String(foundCategory._id), 'GetCategory returned wrong ID').to.equal(String(insertedId));
			expect(foundCategory.mediaType, 'GetCategory returned wrong media type').to.equal(insertedCategory.mediaType);
		});

		it('GetCategory should only get a category for the current user', async() => {

			let insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, firstU));
			const firstId = insertedCategory._id;
			insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, secondU));

			let foundCategory = await categoryController.getCategory(firstU.user, firstId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;

			foundCategory = await categoryController.getCategory(secondU.user, firstId);
			expect(foundCategory, 'GetCategory returned an defined result').to.be.undefined;
		});

		it('GetCategory should return the correct category after two SaveCategory (insert and update)', async() => {

			const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, firstU));
			const insertedId = insertedCategory._id;

			const newName = randomName('Changed');
			await categoryController.saveCategory(getTestCategory(insertedId, firstU, newName));

			let foundCategory = await categoryController.getCategory(firstU.user, insertedId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(String(foundCategory._id), 'GetCategory returned wrong ID').to.equal(String(insertedId));
			expect(foundCategory.name, 'GetCategory returned wrong name').to.equal(newName);
		});

		it('GetAllCategories should return all categories for the given user', async() => {

			const firstUCategories: CategoryInternal[] = [];
			const secondUCategories: CategoryInternal[] = [];

			firstUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, firstU)));
			secondUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, secondU)));
			firstUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, firstU)));
			firstUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, firstU)));
			secondUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, secondU)));

			const foundfirstUCategories = await categoryController.getAllCategories(firstU.user);
			expect(foundfirstUCategories, 'GetAllCategories did not return the correct number of results for first user').to.have.lengthOf(firstUCategories.length);
			expect(foundfirstUCategories.map(extractId), 'GetAllCategories did not return the correct results for first user').to.have.members(firstUCategories.map(extractId));

			const foundsecondUCategories = await categoryController.getAllCategories(secondU.user);
			expect(foundsecondUCategories, 'GetAllCategories did not return the correct number of results for second user').to.have.lengthOf(secondUCategories.length);
			expect(foundsecondUCategories.map(extractId), 'GetAllCategories did not return the correct results for second user').to.have.members(secondUCategories.map(extractId));
		});

		it('SaveCategory (insert) should not accept an invalid user', async() => {

			try {

				await categoryController.saveCategory(getTestCategory(undefined, { user: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveCategory should have returned an error';
		});

		it('SaveCategory (update) should not accept an invalid user', async() => {

			const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, firstU));
			const insertedId = insertedCategory._id;

			try {

				await categoryController.saveCategory(getTestCategory(insertedId, { user: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveCategory should have returned an error';
		});
		
		it('GetCategory after DeleteCategory should return undefined', async() => {
			
			const category = await categoryController.saveCategory(getTestCategory(undefined, firstU));
			const categoryId = category._id;

			await categoryController.deleteCategory(firstU.user, categoryId, false);

			const foundCategory = await categoryController.getCategory(firstU.user, categoryId);
			expect(foundCategory, 'GetCategory returned a defined result').to.be.undefined;
		});

		it('Deleting a user should also delete all its categories', async function() {

			this.timeout(4000);

			await categoryController.saveCategory(getTestCategory(undefined, firstU));
			await categoryController.saveCategory(getTestCategory(undefined, firstU));
			await categoryController.saveCategory(getTestCategory(undefined, firstU));

			await userController.deleteUser(firstU.user, true);

			const foundCategories = await categoryController.getAllCategories(firstU.user);
			expect(foundCategories, 'GetAllCategories did not return the correct number of results').to.have.lengthOf(0);
		});
	});
});

