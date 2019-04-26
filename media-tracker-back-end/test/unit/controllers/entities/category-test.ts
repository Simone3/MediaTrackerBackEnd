import { categoryController } from 'app/controllers/entities/category';
import { userController } from 'app/controllers/entities/user';
import { CategoryInternal } from 'app/models/internal/category';
import chai from 'chai';
import { extractId, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the category controller
 */
describe('CategoryController Tests', () => {
	
	describe('CategoryController Tests', () => {

		let firstUser: string;
		let secondUser: string;
		
		// Create new users for each test
		beforeEach(async() => {

			let insertedUser = await userController.saveUser({ _id: undefined, name: randomName('First') });
			firstUser = insertedUser._id;

			insertedUser = await userController.saveUser({ _id: undefined, name: randomName('Second') });
			secondUser = insertedUser._id;
		});

		const buildCategory = (_id: unknown, name: string, user?: string): CategoryInternal => {
			
			return {
				_id: _id,
				mediaType: 'MOVIE',
				owner: user ? user : firstUser,
				name: name
			};
		};

		it('GetCategory should return the correct category after SaveCategory', async() => {

			const insertedCategory = await categoryController.saveCategory(buildCategory(undefined, randomName()));
			const insertedId = insertedCategory._id;
			expect(insertedCategory._id, 'SaveCategory (insert) returned empty ID').to.exist;

			let foundCategory = await categoryController.getCategory(firstUser, insertedId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(String(foundCategory._id), 'GetCategory returned wrong ID').to.equal(String(insertedId));
			expect(foundCategory.mediaType, 'GetCategory returned wrong media type').to.equal(insertedCategory.mediaType);
		});

		it('GetCategory should only get a category for the current user', async() => {

			let insertedCategory = await categoryController.saveCategory(buildCategory(undefined, randomName(), firstUser));
			const firstId = insertedCategory._id;
			insertedCategory = await categoryController.saveCategory(buildCategory(undefined, randomName(), secondUser));

			let foundCategory = await categoryController.getCategory(firstUser, firstId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;

			foundCategory = await categoryController.getCategory(secondUser, firstId);
			expect(foundCategory, 'GetCategory returned an defined result').to.be.undefined;
		});

		it('GetCategory should return the correct category after two SaveCategory (insert and update)', async() => {

			const insertedCategory = await categoryController.saveCategory(buildCategory(undefined, randomName()));
			const insertedId = insertedCategory._id;

			const newName = randomName('Changed');
			await categoryController.saveCategory(buildCategory(insertedId, newName));

			let foundCategory = await categoryController.getCategory(firstUser, insertedId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(String(foundCategory._id), 'GetCategory returned wrong ID').to.equal(String(insertedId));
			expect(foundCategory.name, 'GetCategory returned wrong name').to.equal(newName);
		});

		it('GetAllCategories should return all categories for the given user', async() => {

			const firstUserCategories: CategoryInternal[] = [];
			const secondUserCategories: CategoryInternal[] = [];

			firstUserCategories.push(await categoryController.saveCategory(buildCategory(undefined, randomName(), firstUser)));
			secondUserCategories.push(await categoryController.saveCategory(buildCategory(undefined, randomName(), secondUser)));
			firstUserCategories.push(await categoryController.saveCategory(buildCategory(undefined, randomName(), firstUser)));
			firstUserCategories.push(await categoryController.saveCategory(buildCategory(undefined, randomName(), firstUser)));
			secondUserCategories.push(await categoryController.saveCategory(buildCategory(undefined, randomName(), secondUser)));

			const foundFirstUserCategories = await categoryController.getAllCategories(firstUser);
			expect(foundFirstUserCategories, 'GetAllCategories did not return the correct number of results for first user').to.have.lengthOf(firstUserCategories.length);
			expect(foundFirstUserCategories.map(extractId), 'GetAllCategories did not return the correct results for first user').to.have.members(firstUserCategories.map(extractId));

			const foundSecondUserCategories = await categoryController.getAllCategories(secondUser);
			expect(foundSecondUserCategories, 'GetAllCategories did not return the correct number of results for second user').to.have.lengthOf(secondUserCategories.length);
			expect(foundSecondUserCategories.map(extractId), 'GetAllCategories did not return the correct results for second user').to.have.members(secondUserCategories.map(extractId));
		});

		it('SaveCategory (insert) should not accept an invalid user', async() => {

			try {

				await categoryController.saveCategory(buildCategory(undefined, randomName(), '5cbf26ea895c281b54b6737f'));
			}
			catch(error) {

				return;
			}

			throw 'SaveCategory should have returned an error';
		});

		it('SaveCategory (update) should not accept an invalid user', async() => {

			const insertedCategory = await categoryController.saveCategory(buildCategory(undefined, randomName()));
			const insertedId = insertedCategory._id;

			try {

				await categoryController.saveCategory(buildCategory(insertedId, randomName(), '5cbf26ea895c281b54b6737f'));
			}
			catch(error) {

				return;
			}

			throw 'SaveCategory should have returned an error';
		});
		
		it('GetCategory after DeleteCategory should return undefined', async() => {
			
			const category = await categoryController.saveCategory(buildCategory(undefined, randomName()));
			const categoryId = category._id;

			await categoryController.deleteCategory(firstUser, categoryId, false);

			const foundCategory = await categoryController.getCategory(firstUser, categoryId);
			expect(foundCategory, 'GetCategory returned a defined result').to.be.undefined;
		});

		it('Deleting a user should also delete all its categories', async function() {

			this.timeout(4000);

			await categoryController.saveCategory(buildCategory(undefined, randomName(), firstUser));
			await categoryController.saveCategory(buildCategory(undefined, randomName(), firstUser));
			await categoryController.saveCategory(buildCategory(undefined, randomName(), firstUser));

			await userController.deleteUser(firstUser, true);

			const foundCategories = await categoryController.getAllCategories(firstUser);
			expect(foundCategories, 'GetAllCategories did not return the correct number of results').to.have.lengthOf(0);
		});
	});
});

