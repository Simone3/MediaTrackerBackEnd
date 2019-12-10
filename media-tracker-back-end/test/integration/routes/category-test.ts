import { categoryController } from 'app/controllers/entities/category';
import { IdentifiedCategory } from 'app/data/models/api/category';
import { CategoryInternal } from 'app/data/models/internal/category';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { getTestCategory, initTestUHelper, TestU } from 'helpers/entities-builder-helper';
import { setupTestServer } from 'helpers/server-handler-helper';
import { extract, randomName } from 'helpers/test-misc-helper';

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
					mediaType: 'MOVIE',
					color: '#0000FF'
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

			const category = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			const categoryId: string = String(category._id);
			const newName = randomName('Changed');

			await callHelper('PUT', `/users/${firstU.user}/categories/${categoryId}`, {
				category: {
					name: newName,
					mediaType: 'MOVIE',
					color: '#0000FF'
				}
			});
			
			let foundCategory = await categoryController.getCategory(firstU.user, categoryId);
			expect(foundCategory, 'GetCategory returned an undefined result').not.to.be.undefined;
			foundCategory = foundCategory as CategoryInternal;
			expect(foundCategory.name, 'GetCategory returned the wrong name').to.equal(newName);
		});

		it('Should return all user categories', async() => {

			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU, 'Rrr'));
			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU, 'Bbb'));
			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU, 'Zzz'));
			
			const response = await callHelper('GET', `/users/${firstU.user}/categories`);
			expect(response.categories, 'API did not return the correct number of categories').to.have.lengthOf(3);
			expect(extract(response.categories, 'name'), 'API did not return the correct categories').to.eql([ 'Bbb', 'Rrr', 'Zzz' ]);
		});

		it('Should delete an existing category', async function() {

			this.timeout(4000);

			const category = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
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

		it('Should save and then retrieve ALL fields', async() => {

			const sourceCategory: Required<IdentifiedCategory> = {
				uid: '',
				name: randomName(),
				mediaType: 'VIDEOGAME',
				color: '#00ff00'
			};

			await callHelper('POST', `/users/${firstU.user}/categories`, {
				newCategory: sourceCategory
			});

			const response = await callHelper('GET', `/users/${firstU.user}/categories`);

			sourceCategory.uid = response.categories[0].uid;
			expect(response.categories[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceCategory);
		});
	});
});
