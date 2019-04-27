import { categoryController } from 'app/controllers/entities/category';
import { movieEntityController } from 'app/controllers/entities/media-items/movie';
import { CategoryInternal } from 'app/models/internal/category';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestCategory, getTestMovie, initTestUHelper, TestU } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extractName, randomName } from 'helpers/test-misc-helper';

const expect = chai.expect;

/**
 * Tests for the category API
 */
describe('Category API Tests', () => {

	setupTestDatabaseConnection();
	setupTestServer();

	describe('Category API Tests', () => {

		const firstU: TestU = { user: '' };

		// Create new users for each test
		beforeEach(async() => {

			await initTestUHelper(firstU, 'First');
		});

		it('Should create a new category', async() => {

			const name = randomName();
			const response = await callHelper('POST', `/users/${firstU.user}/categories`, {
				newCategory: {
					name: name,
					mediaType: 'MOVIE'
				}
			});
			
			const categoryId: string = response.uid;
			expect(categoryId, 'API did not return a UID').not.to.be.undefined;
			
			let foundCategory = await categoryController.getCategory(firstU.user, categoryId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(foundCategory.name, 'GetCategory returned the wrong name').to.equal(name);
		});

		it('Should update an existing category', async() => {

			const category = await categoryController.saveCategory(getTestCategory(undefined, firstU));
			const categoryId: string = String(category._id);
			const newName = randomName('Changed');

			await callHelper('PUT', `/users/${firstU.user}/categories/${categoryId}`, {
				category: {
					name: newName,
					mediaType: 'MOVIE'
				}
			});
			
			let foundCategory = await categoryController.getCategory(firstU.user, categoryId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(foundCategory.name, 'GetCategory returned the wrong name').to.equal(newName);
		});

		it('Should not allow to change media type if the category is not empty', async() => {

			const category = await categoryController.saveCategory(getTestCategory(undefined, firstU));
			const categoryId: string = String(category._id);

			await movieEntityController.saveMediaItem(getTestMovie(undefined, { user: firstU.user, category: categoryId }));
			
			await callHelper('PUT', `/users/${firstU.user}/categories/${categoryId}`, {
				category: {
					name: randomName(),
					mediaType: 'BOOK'
				}
			}, 500);
		});

		it('Should return all user categories', async() => {

			await categoryController.saveCategory(getTestCategory(undefined, firstU, 'Rrr'));
			await categoryController.saveCategory(getTestCategory(undefined, firstU, 'Bbb'));
			await categoryController.saveCategory(getTestCategory(undefined, firstU, 'Zzz'));
			
			const response = await callHelper('GET', `/users/${firstU.user}/categories`);
			expect(response.categories, 'API did not return the correct number of categories').to.have.lengthOf(3);
			expect(response.categories.map(extractName), 'API did not return the correct categories').to.eql([ 'Bbb', 'Rrr', 'Zzz' ]);
		});

		it('Should delete an existing category', async() => {

			const category = await categoryController.saveCategory(getTestCategory(undefined, firstU));
			const categoryId: string = String(category._id);

			await callHelper('DELETE', `/users/${firstU.user}/categories/${categoryId}`);
			
			const foundCategory = await categoryController.getCategory(firstU.user, categoryId);
			expect(foundCategory, 'GetCategory returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper('POST', `/users/${firstU.user}/categories`, {
				newCategory: {
					mediaType: 'MOVIE'
				}
			}, 500);
		});

		it('Should check for media type validity', async() => {

			await callHelper('POST', `/users/${firstU.user}/categories`, {
				newCategory: {
					name: randomName(),
					mediaType: 'MOVE'
				}
			}, 500);
		});
	});
});