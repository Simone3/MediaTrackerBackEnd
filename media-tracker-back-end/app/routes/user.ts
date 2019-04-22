
import express, { Router } from 'express';
import { userController } from '../controllers/entities/user';
import { AddUserResponse, UpdateUserResponse, DeleteUserResponse, AddUserRequest, UpdateUserRequest } from '../models/api/user';
import { userMapper } from '../mappers/user';
import { parserValidator } from '../controllers/utilities/parser-validator';
import { ErrorResponse } from '../models/api/common';
import { AppError } from '../models/error/error';
import { logger } from '../loggers/logger';
import { miscUtilsController } from '../controllers/utilities/misc-utils';

var router: Router = express.Router();

/**
 * Route to add a new user
 */
router.post('/users', (request, response, __) => {

	parserValidator.parseAndValidate(AddUserRequest, request.body)
		.then((body) => {

			const newUser = userMapper.toInternal({...body.newUser, uid: ""});
			userController.saveUser(newUser)
				.then((savedUser) => {
				
					const body: AddUserResponse = {
						message: 'User successfully added',
						userId: savedUser._id
					};

					response.json(body);
				})
				.catch((error) => {

					logger.error('Add user generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				})
		})
		.catch((error) => {

			logger.error('Add user request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
		});
});

/**
 * Route to update an existing user
 */
router.put('/users/:id', (request, response, __) => {

	const id: string = request.params.id;

	parserValidator.parseAndValidate(UpdateUserRequest, request.body)
		.then((body) => {

			const user = userMapper.toInternal({...body.user, uid: id});
			userController.saveUser(user)
				.then(() => {
				
					const body: UpdateUserResponse = {
						message: 'User successfully updated'
					};
		
					response.json(body);
				})
				.catch((error) => {

					logger.error('Update user generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				})
		})
		.catch((error) => {

			logger.error('Update user request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
		});
});

/**
 * Route to delete a user
 */
router.delete('/users/:id', (request, response, __) => {

	const id: string = request.params.id;
	const forceEvenIfNotEmpty = miscUtilsController.parseBoolean(request.query.forceEvenIfNotEmpty);

	userController.deleteUser(id, forceEvenIfNotEmpty)
		.then(() => {
			
			const body: DeleteUserResponse = {
				message: 'User successfully deleted'
			};

			response.json(body);
		})
		.catch((error) => {

			logger.error('Delete user generic error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
		});
});

/**
 * Router for users API
 */
export const userRouter: Router = router;
