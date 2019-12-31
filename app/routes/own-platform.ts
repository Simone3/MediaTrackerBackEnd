
import { userResourceAuthorizationMiddleware } from 'app/auth/authorization';
import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { ownPlatformFilterMapper, ownPlatformMapper } from 'app/data/mappers/own-platform';
import { AddOwnPlatformRequest, AddOwnPlatformResponse, DeleteOwnPlatformResponse, FilterOwnPlatformsRequest, FilterOwnPlatformsResponse, GetAllOwnPlatformsResponse, MergeOwnPlatformsRequest, MergeOwnPlatformsResponse, UpdateOwnPlatformRequest, UpdateOwnPlatformResponse } from 'app/data/models/api/own-platform';
import { AppError } from 'app/data/models/error/error';
import { errorResponseFactory } from 'app/factories/error';
import { logger } from 'app/loggers/logger';
import { parserValidator } from 'app/utilities/parser-validator';
import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * Route to get all saved own platforms
 */
router.get('/users/:userId/categories/:categoryId/own-platforms', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;

	ownPlatformController.getAllOwnPlatforms(userId, categoryId)
		.then((ownPlatforms) => {

			const responseBody: GetAllOwnPlatformsResponse = {
				ownPlatforms: ownPlatformMapper.toExternalList(ownPlatforms)
			};
			
			response.json(responseBody);
		})
		.catch((error) => {

			logger.error('Get own platforms generic error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Route to get all saved own platforms matching some filter
 */
router.post('/users/:userId/categories/:categoryId/own-platforms/filter', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;

	parserValidator.parseAndValidate(FilterOwnPlatformsRequest, request.body)
		.then((parsedRequest) => {

			const filterBy = parsedRequest.filter ? ownPlatformFilterMapper.toInternal(parsedRequest.filter) : undefined;
			ownPlatformController.filterOwnPlatforms(userId, categoryId, filterBy)
				.then((ownPlatforms) => {
		
					const responseBody: FilterOwnPlatformsResponse = {
						ownPlatforms: ownPlatformMapper.toExternalList(ownPlatforms)
					};
					
					response.json(responseBody);
				})
				.catch((error) => {
		
					logger.error('Filter own platforms generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Filter own platforms request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to add a new own platform
 */
router.post('/users/:userId/categories/:categoryId/own-platforms', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;

	parserValidator.parseAndValidate(AddOwnPlatformRequest, request.body)
		.then((parsedRequest) => {

			const newOwnPlatform = ownPlatformMapper.toInternal({ ...parsedRequest.newOwnPlatform, uid: '' }, { userId, categoryId });
			ownPlatformController.saveOwnPlatform(newOwnPlatform)
				.then((savedOwnPlatform) => {
			
					const responseBody: AddOwnPlatformResponse = {
						message: 'OwnPlatform successfully added',
						uid: savedOwnPlatform._id
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Add own platform generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Add own platform request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to merge two or more existing own platforms
 */
router.put('/users/:userId/categories/:categoryId/own-platforms/merge', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;

	parserValidator.parseAndValidate(MergeOwnPlatformsRequest, request.body)
		.then((parsedRequest) => {

			const ownPlatform = ownPlatformMapper.toInternal({ ...parsedRequest.mergedOwnPlatform, uid: '' }, { userId, categoryId });
			ownPlatformController.mergeOwnPlatforms(parsedRequest.ownPlatformIds, ownPlatform)
				.then(() => {
				
					const responseBody: MergeOwnPlatformsResponse = {
						message: 'OwnPlatforms successfully merged'
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Merge own platforms generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Merge own platforms request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to update an existing own platform
 */
router.put('/users/:userId/categories/:categoryId/own-platforms/:id', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;
	const id: string = request.params.id;

	parserValidator.parseAndValidate(UpdateOwnPlatformRequest, request.body)
		.then((parsedRequest) => {

			const ownPlatform = ownPlatformMapper.toInternal({ ...parsedRequest.ownPlatform, uid: id }, { userId, categoryId });
			ownPlatformController.saveOwnPlatform(ownPlatform)
				.then(() => {
				
					const responseBody: UpdateOwnPlatformResponse = {
						message: 'OwnPlatform successfully updated'
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Update own platform generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Update own platform request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to delete a own platform
 */
router.delete('/users/:userId/categories/:categoryId/own-platforms/:id', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;
	const id: string = request.params.id;
	
	ownPlatformController.deleteOwnPlatform(userId, categoryId, id)
		.then(() => {
			
			const responseBody: DeleteOwnPlatformResponse = {
				message: 'OwnPlatform successfully deleted'
			};

			response.json(responseBody);
		})
		.catch((error) => {

			logger.error('Delete own platform generic error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Router for own platforms API
 */
export const ownPlatformRouter: Router = router;
