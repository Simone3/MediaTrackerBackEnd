
import express, { Router } from 'express';
import { categoryController } from '../controllers/entities/category';
import { GetAllCategoriesResponse, AddCategoryResponse, UpdateCategoryResponse, DeleteCategoryResponse, AddCategoryRequest, UpdateCategoryRequest } from '../models/api/category';
import { categoryMapper } from '../mappers/category';
import { parserValidator } from '../controllers/utilities/parser-validator';
import { ErrorResponse } from '../models/api/common';
import { AppError } from '../models/error/error';

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

			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
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
			categoryController.saveCategory(newCategory)
				.then(() => {
			
					const body: AddCategoryResponse = {};
					response.json(body);
				})
				.catch((error) => {

					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				});
		})
		.catch((error) => {

			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
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
			categoryController.saveCategory(category)
			.then(() => {
			
				const body: UpdateCategoryResponse = {};
				response.json(body);
			})
			.catch((error) => {

				response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
			});
		})
		.catch((error) => {

			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
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

			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
		});
});

/**
 * Router for categories API
 */
export const categoryRouter: Router = router;
