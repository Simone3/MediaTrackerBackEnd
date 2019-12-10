import { categoryController } from 'app/controllers/entities/category';
import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { userController } from 'app/controllers/entities/user';
import { CategoryInternal } from 'app/data/models/internal/category';
import chai from 'chai';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestCategory, getTestMovie, initTestUHelper, TestU } from 'helpers/entities-builder-helper';
import { extractAsString, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the category controller
 */
describe('CategoryController Tests', () => {
	
	setupTestDatabaseConnection();
	
	describe('CategoryController Tests', () => {

		const firstU: TestU = { user: '' };
		const secondU: TestU = { user: '' };

		// Create new users for each test
		beforeEach(async() => {

			await initTestUHelper(firstU, 'First');
			await initTestUHelper(secondU, 'Second');
		});

		it('GetCategory should return the correct category after SaveCategory', async() => {

			const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			const insertedId = insertedCategory._id;
			expect(insertedCategory._id, 'SaveCategory (insert) returned empty ID').to.exist;

			let foundCategory = await categoryController.getCategory(firstU.user, insertedId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(String(foundCategory._id), 'GetCategory returned wrong ID').to.equal(String(insertedId));
			expect(foundCategory.mediaType, 'GetCategory returned wrong media type').to.equal(insertedCategory.mediaType);
		});

		it('GetCategory should only get a category for the current user', async() => {

			let insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			const firstId = insertedCategory._id;
			insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', secondU));

			let foundCategory = await categoryController.getCategory(firstU.user, firstId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;

			foundCategory = await categoryController.getCategory(secondU.user, firstId);
			expect(foundCategory, 'GetCategory returned an defined result').to.be.undefined;
		});

		it('GetCategory should return the correct category after two SaveCategory (insert and update)', async() => {

			const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			const insertedId = insertedCategory._id;

			const newName = randomName('Changed');
			await categoryController.saveCategory(getTestCategory(insertedId, 'MOVIE', firstU, newName));

			let foundCategory = await categoryController.getCategory(firstU.user, insertedId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(String(foundCategory._id), 'GetCategory returned wrong ID').to.equal(String(insertedId));
			expect(foundCategory.name, 'GetCategory returned wrong name').to.equal(newName);
		});

		it('GetAllCategories should return all categories for the given user', async() => {

			const firstUCategories: CategoryInternal[] = [];
			const secondUCategories: CategoryInternal[] = [];

			firstUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU)));
			secondUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', secondU)));
			firstUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU)));
			firstUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU)));
			secondUCategories.push(await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', secondU)));

			const foundfirstUCategories = await categoryController.getAllCategories(firstU.user);
			expect(foundfirstUCategories, 'GetAllCategories did not return the correct number of results for first user').to.have.lengthOf(firstUCategories.length);
			expect(extractAsString(foundfirstUCategories, '_id'), 'GetAllCategories did not return the correct results for first user').to.have.members(extractAsString(firstUCategories, '_id'));

			const foundsecondUCategories = await categoryController.getAllCategories(secondU.user);
			expect(foundsecondUCategories, 'GetAllCategories did not return the correct number of results for second user').to.have.lengthOf(secondUCategories.length);
			expect(extractAsString(foundsecondUCategories, '_id'), 'GetAllCategories did not return the correct results for second user').to.have.members(extractAsString(secondUCategories, '_id'));
		});

		it('SaveCategory (update) not allow to change media type if the category is not empty', async() => {

			const category = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			const categoryId: string = String(category._id);

			await movieEntityController.saveMediaItem(getTestMovie(undefined, { user: firstU.user, category: categoryId }));
			
			try {

				await categoryController.saveCategory(getTestCategory(categoryId, 'BOOK', firstU));
			}
			catch(error) {

				return;
			}

			throw 'SaveCategory should have returned an error';
		});

		it('SaveCategory (insert) should not accept an invalid user', async() => {

			try {

				await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', { user: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveCategory should have returned an error';
		});

		it('SaveCategory (update) should not accept an invalid user', async() => {

			const insertedCategory = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			const insertedId = insertedCategory._id;

			try {

				await categoryController.saveCategory(getTestCategory(insertedId, 'MOVIE', { user: '5cbf26ea895c281b54b6737f' }));
			}
			catch(error) {

				return;
			}

			throw 'SaveCategory should have returned an error';
		});
		
		it('GetCategory after DeleteCategory should return undefined', async function() {
			
			this.timeout(4000);

			const category = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			const categoryId = category._id;

			await categoryController.deleteCategory(firstU.user, categoryId);

			const foundCategory = await categoryController.getCategory(firstU.user, categoryId);
			expect(foundCategory, 'GetCategory returned a defined result').to.be.undefined;
		});

		it('Deleting a user should also delete all its categories', async function() {

			this.timeout(4000);

			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));

			await userController.deleteUser(firstU.user);

			const foundCategories = await categoryController.getAllCategories(firstU.user);
			expect(foundCategories, 'GetAllCategories did not return the correct number of results').to.have.lengthOf(0);
		});
	});
});

