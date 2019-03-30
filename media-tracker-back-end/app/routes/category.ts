
import express, { Router } from 'express';
import { categoryController } from '../controllers/entities/category';
import { GetAllCategoriesResponse, AddCategoryResponse, UpdateCategoryResponse, DeleteCategoryResponse, AddCategoryRequest, UpdateCategoryRequest } from '../models/api/category';
import { categoryMapper } from '../mappers/category';
import { parserValidator } from '../controllers/utilities/parser-validator';

var router: Router = express.Router();

/**
 * Route to get all saved categories
 */
router.get('/users/:userId/categories', (request, response, __) => {

	const {userId} = request.params;

	categoryController.getAllCategories(userId)
		.then((categories) => {

			const body: GetAllCategoriesResponse = {
				categories: categoryMapper.internalToApiList(categories)
			};
			
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot get all categories: ' + error);
		});
});

/**
 * Route to add a new category
 */
router.post('/users/:userId/categories', (request, response, __) => {

	const {userId} = request.params;

	parserValidator.parseAndValidate(AddCategoryRequest, request.body)
		.then((body) => {

			const newCategory = categoryMapper.apiToInternal(body.newCategory, userId);
			return categoryController.saveCategory(newCategory)
		})
		.then(() => {
		
			const body: AddCategoryResponse = {};
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot add category: ' + error);
		});
});

/**
 * Route to update an existing category
 */
router.put('/users/:userId/categories/:id', (request, response, __) => {

	const {userId} = request.params;

	parserValidator.parseAndValidate(UpdateCategoryRequest, request.body)
		.then((body) => {

			const category = categoryMapper.apiToInternal(body.category, userId);
			category._id = request.params.id;
			return categoryController.saveCategory(category)
		})
		.then(() => {
		
			const body: UpdateCategoryResponse = {};
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot update category: ' + error);
		});
});

/**
 * Route to delete a category
 */
router.delete('/users/:userId/categories/:id', (request, response, __) => {

	categoryController.deleteCategory(request.params.id)
		.then(() => {
			
			const body: DeleteCategoryResponse = {};
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot delete category: ' + error);
		});
});

/**
 * Router for categories API
 */
export const categoryRouter: Router = router;
