
import { ownPlatformController } from 'app/controllers/entities/own-platform';
import { logger } from 'app/loggers/logger';
import { ownPlatformMapper } from 'app/mappers/own-platform';
import { ErrorResponse } from 'app/models/api/common';
import { AddOwnPlatformRequest, AddOwnPlatformResponse, DeleteOwnPlatformResponse, GetAllOwnPlatformsResponse, UpdateOwnPlatformRequest, UpdateOwnPlatformResponse } from 'app/models/api/own-platform';
import { AppError } from 'app/models/error/error';
import { parserValidator } from 'app/utilities/parser-validator';
import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * Route to get all saved own platforms
 */
router.get('/users/:userId/categories/:categoryId/own-platforms', (request, response) => {

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
			response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Route to add a new own platform
 */
router.post('/users/:userId/categories/:categoryId/own-platforms', (request, response) => {

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
					response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Add own platform request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to update an existing own platform
 */
router.put('/users/:userId/categories/:categoryId/own-platforms/:id', (request, response) => {

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
					response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Update own platform request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to delete a own platform
 */
router.delete('/users/:userId/categories/:categoryId/own-platforms/:id', (request, response) => {

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
			response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Router for own platforms API
 */
export const ownPlatformRouter: Router = router;
