
import { userResourceAuthorizationMiddleware } from 'app/auth/authorization';
import { categoryController } from 'app/controllers/entities/category';
import { categoryFilterMapper, categoryMapper } from 'app/data/mappers/category';
import { AddCategoryRequest, AddCategoryResponse, DeleteCategoryResponse, FilterCategoriesRequest, FilterCategoriesResponse, GetAllCategoriesResponse, UpdateCategoryRequest, UpdateCategoryResponse } from 'app/data/models/api/category';
import { AppError } from 'app/data/models/error/error';
import { errorResponseFactory } from 'app/factories/error';
import { logger } from 'app/loggers/logger';
import { parserValidator } from 'app/utilities/parser-validator';
import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * Route to get all saved categories
 */
router.get('/users/:userId/categories', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;

	categoryController.getAllCategories(userId)
		.then((categories) => {

			const responseBody: GetAllCategoriesResponse = {
				categories: categoryMapper.toExternalList(categories)
			};
			
			response.json(responseBody);
		})
		.catch((error) => {

			logger.error('Get categories generic error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Route to get all saved categories matching some filter
 */
router.post('/users/:userId/categories/filter', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;

	parserValidator.parseAndValidate(FilterCategoriesRequest, request.body)
		.then((parsedRequest) => {

			const filterBy = parsedRequest.filter ? categoryFilterMapper.toInternal(parsedRequest.filter) : undefined;
			categoryController.filterCategories(userId, filterBy)
				.then((categories) => {
		
					const responseBody: FilterCategoriesResponse = {
						categories: categoryMapper.toExternalList(categories)
					};
					
					response.json(responseBody);
				})
				.catch((error) => {
		
					logger.error('Filter categories generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Filter category request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to add a new category
 */
router.post('/users/:userId/categories', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;

	parserValidator.parseAndValidate(AddCategoryRequest, request.body)
		.then((parsedRequest) => {

			const newCategory = categoryMapper.toInternal({ ...parsedRequest.newCategory, uid: '' }, { userId });
			categoryController.saveCategory(newCategory)
				.then((savedCategory) => {
			
					const responseBody: AddCategoryResponse = {
						message: 'Category successfully added',
						uid: savedCategory._id
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Add category generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Add category request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to update an existing category
 */
router.put('/users/:userId/categories/:id', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const id: string = request.params.id;

	parserValidator.parseAndValidate(UpdateCategoryRequest, request.body)
		.then((parsedRequest) => {

			const category = categoryMapper.toInternal({ ...parsedRequest.category, uid: id }, { userId });
			categoryController.saveCategory(category)
				.then(() => {
				
					const responseBody: UpdateCategoryResponse = {
						message: 'Category successfully updated'
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Update category generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Update category request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to delete a category
 */
router.delete('/users/:userId/categories/:id', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const id: string = request.params.id;

	categoryController.deleteCategory(userId, id)
		.then(() => {
			
			const responseBody: DeleteCategoryResponse = {
				message: 'Category successfully deleted'
			};

			response.json(responseBody);
		})
		.catch((error) => {

			logger.error('Delete category generic error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Router for categories API
 */
export const categoryRouter: Router = router;
