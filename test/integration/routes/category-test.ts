import { categoryController } from 'app/controllers/entities/category';
import { AddCategoryRequest, AddCategoryResponse, DeleteCategoryResponse, FilterCategoriesRequest, FilterCategoriesResponse, GetAllCategoriesResponse, IdentifiedCategory, UpdateCategoryRequest, UpdateCategoryResponse } from 'app/data/models/api/category';
import { CategoryInternal } from 'app/data/models/internal/category';
import chai from 'chai';
import { callHelper } from 'helpers/api-caller-helper';
import { setupTestDatabaseConnection } from 'helpers/database-handler-helper';
import { TestU, getTestCategory, initTestUHelper } from 'helpers/entities-builder-helper';
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
		const secondU: TestU = { user: '' };

		// Create new users for each test
		beforeEach(async() => {

			await initTestUHelper(firstU, 'First');
			await initTestUHelper(secondU, 'Second');
		});

		it('Should create a new category', async() => {

			const name = randomName();
			const response = await callHelper<AddCategoryRequest, AddCategoryResponse>('POST', `/users/${firstU.user}/categories`, firstU.user, {
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
			const categoryId = String(category._id);
			const newName = randomName('Changed');

			await callHelper<UpdateCategoryRequest, UpdateCategoryResponse>('PUT', `/users/${firstU.user}/categories/${categoryId}`, firstU.user, {
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
			
			const response = await callHelper<{}, GetAllCategoriesResponse>('GET', `/users/${firstU.user}/categories`, firstU.user);
			expect(response.categories, 'API did not return the correct number of categories').to.have.lengthOf(3);
			expect(extract(response.categories, 'name'), 'API did not return the correct categories').to.eql([ 'Bbb', 'Rrr', 'Zzz' ]);
		});

		it('Should return all user categories that match the filter', async() => {

			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU, 'Rrr'));
			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU, 'Bbb'));
			await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU, 'Zzz'));
			
			const response = await callHelper<FilterCategoriesRequest, FilterCategoriesResponse>('POST', `/users/${firstU.user}/categories/filter`, firstU.user, {
				filter: {
					name: 'bbB'
				}
			});
			expect(response.categories, 'API did not return the correct number of categories').to.have.lengthOf(1);
			expect(extract(response.categories, 'name'), 'API did not return the correct categories').to.eql([ 'Bbb' ]);
		});

		it('Should delete an existing category', async function() {

			const category = await categoryController.saveCategory(getTestCategory(undefined, 'MOVIE', firstU));
			const categoryId = String(category._id);

			await callHelper<{}, DeleteCategoryResponse>('DELETE', `/users/${firstU.user}/categories/${categoryId}`, firstU.user);
			
			const foundCategory = await categoryController.getCategory(firstU.user, categoryId);
			expect(foundCategory, 'GetCategory returned a defined result').to.be.undefined;
		});

		it('Should check for name validity', async() => {

			await callHelper<{}, AddCategoryResponse>('POST', `/users/${firstU.user}/categories`, firstU.user, {
				newCategory: {
					mediaType: 'MOVIE'
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should check for media type validity', async() => {

			await callHelper<{}, AddCategoryResponse>('POST', `/users/${firstU.user}/categories`, firstU.user, {
				newCategory: {
					name: randomName(),
					mediaType: 'MOVE'
				}
			}, {
				expectedStatus: 500
			});
		});

		it('Should save and then retrieve ALL fields', async() => {

			const sourceCategory: Required<IdentifiedCategory> = {
				uid: '',
				name: randomName(),
				mediaType: 'VIDEOGAME',
				color: '#00ff00'
			};

			await callHelper<AddCategoryRequest, AddCategoryResponse>('POST', `/users/${firstU.user}/categories`, firstU.user, {
				newCategory: sourceCategory
			});

			const response = await callHelper<{}, GetAllCategoriesResponse>('GET', `/users/${firstU.user}/categories`, firstU.user);

			sourceCategory.uid = response.categories[0].uid;
			expect(response.categories[0], 'API either did not save or did not retrieve ALL fields').to.eql(sourceCategory);
		});

		it('Should check for Authorization header presence', async() => {

			await callHelper('GET', `/users/${firstU.user}/categories`, firstU.user, undefined, {
				customAuthorizationHeader: '',
				expectedStatus: 401
			});
		});

		it('Should check for Authorization header validity', async() => {

			await callHelper('GET', `/users/${firstU.user}/categories`, firstU.user, undefined, {
				customAuthorizationHeader: 'dfbvsdfsdf',
				expectedStatus: 401
			});
		});

		it('Should not allow to add to another user\'s categories', async() => {

			await callHelper('POST', `/users/${firstU.user}/categories`, secondU.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to update another user\'s category', async() => {

			await callHelper('PUT', `/users/${firstU.user}/categories/someobjectid`, secondU.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to delete another user\'s category', async() => {

			await callHelper('DELETE', `/users/${firstU.user}/categories/someobjectid`, secondU.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to get another user\'s categories', async() => {

			await callHelper('GET', `/users/${firstU.user}/categories`, secondU.user, undefined, {
				expectedStatus: 403
			});
		});

		it('Should not allow to filter another user\'s categories', async() => {

			await callHelper('POST', `/users/${firstU.user}/categories/filter`, secondU.user, undefined, {
				expectedStatus: 403
			});
		});
	});
});
