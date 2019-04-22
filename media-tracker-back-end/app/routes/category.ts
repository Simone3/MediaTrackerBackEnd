
import express, { Router } from 'express';
import { categoryController } from '../controllers/entities/category';
import { GetAllCategoriesResponse, AddCategoryResponse, UpdateCategoryResponse, DeleteCategoryResponse, AddCategoryRequest, UpdateCategoryRequest } from '../models/api/category';
import { categoryMapper } from '../mappers/category';
import { parserValidator } from '../controllers/utilities/parser-validator';
import { ErrorResponse } from '../models/api/common';
import { AppError } from '../models/error/error';
import { logger } from '../loggers/logger';
import { miscUtilsController } from '../controllers/utilities/misc-utils';

var router: Router = express.Router();

/**
 * Route to get all saved categories
 */
router.get('/users/:userId/categories', (request, response, __) => {

	const userId: string = request.params.userId;

	categoryController.getAllCategories(userId)
		.then((categories) => {

			const body: GetAllCategoriesResponse = {
				categories: categoryMapper.toExternalList(categories)
			};
			
			response.json(body);
		})
		.catch((error) => {

			logger.error('Get categories generic error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
		});
});


/**
 * Route to add a new category
 */
router.post('/users/:userId/categories', (request, response, __) => {

	const userId: string = request.params.userId;

	parserValidator.parseAndValidate(AddCategoryRequest, request.body)
		.then((body) => {

			const newCategory = categoryMapper.toInternal({...body.newCategory, uid: ""}, {userId});
			categoryController.saveCategory(newCategory, body.allowSameName)
				.then(() => {
			
					const body: AddCategoryResponse = {
						message: 'Category successfully added'
					};

					response.json(body);
				})
				.catch((error) => {

					logger.error('Add category generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				});
		})
		.catch((error) => {

			logger.error('Add category request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
		});
});

/**
 * Route to update an existing category
 */
router.put('/users/:userId/categories/:id', (request, response, __) => {

	const userId: string = request.params.userId;
	const id: string = request.params.id;

	parserValidator.parseAndValidate(UpdateCategoryRequest, request.body)
		.then((body) => {

			const category = categoryMapper.toInternal({...body.category, uid: id}, {userId});
			categoryController.saveCategory(category, body.allowSameName)
			.then(() => {
			
				const body: UpdateCategoryResponse = {
					message: 'Category successfully updated'
				};

				response.json(body);
			})
			.catch((error) => {

				logger.error('Update category generic error: %s', error);
				response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
			});
		})
		.catch((error) => {

			logger.error('Update category request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
		});
});

/**
 * Route to delete a category
 */
router.delete('/users/:userId/categories/:id', (request, response, __) => {

	const userId: string = request.params.userId;
	const id: string = request.params.id;

	const forceEvenIfNotEmpty = miscUtilsController.parseBoolean(request.query.forceEvenIfNotEmpty);

	categoryController.deleteCategory(userId, id, forceEvenIfNotEmpty)
		.then(() => {
			
			const body: DeleteCategoryResponse = {
				message: 'Category successfully deleted'
			};

			response.json(body);
		})
		.catch((error) => {

			logger.error('Delete category generic error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
		});
});

/**
 * Router for categories API
 */
export const categoryRouter: Router = router;
