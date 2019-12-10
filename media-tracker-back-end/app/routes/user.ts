
import { userController } from 'app/controllers/entities/user';
import { userMapper } from 'app/data/mappers/user';
import { AddUserRequest, AddUserResponse, DeleteUserResponse, UpdateUserRequest, UpdateUserResponse } from 'app/data/models/api/user';
import { AppError } from 'app/data/models/error/error';
import { errorResponseFactory } from 'app/factories/error';
import { logger } from 'app/loggers/logger';
import { parserValidator } from 'app/utilities/parser-validator';
import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * Route to add a new user
 */
router.post('/users', (request, response) => {

	parserValidator.parseAndValidate(AddUserRequest, request.body)
		.then((parsedRequest) => {

			const newUser = userMapper.toInternal({ ...parsedRequest.newUser, uid: '' });
			userController.saveUser(newUser)
				.then((savedUser) => {
				
					const responseBody: AddUserResponse = {
						message: 'User successfully added',
						uid: savedUser._id
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Add user generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Add user request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to update an existing user
 */
router.put('/users/:id', (request, response) => {

	const id: string = request.params.id;

	parserValidator.parseAndValidate(UpdateUserRequest, request.body)
		.then((parsedRequest) => {

			const user = userMapper.toInternal({ ...parsedRequest.user, uid: id });
			userController.saveUser(user)
				.then(() => {
				
					const responseBody: UpdateUserResponse = {
						message: 'User successfully updated'
					};
		
					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Update user generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Update user request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to delete a user
 */
router.delete('/users/:id', (request, response) => {

	const id: string = request.params.id;
	
	userController.deleteUser(id)
		.then(() => {
			
			const responseBody: DeleteUserResponse = {
				message: 'User successfully deleted'
			};

			response.json(responseBody);
		})
		.catch((error) => {

			logger.error('Delete user generic error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Router for users API
 */
export const userRouter: Router = router;
