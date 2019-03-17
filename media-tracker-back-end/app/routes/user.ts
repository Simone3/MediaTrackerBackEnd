
import express, { Router } from 'express';
import { userController } from '../controllers/user';
import { AddUserResponse, UpdateUserResponse, DeleteUserResponse, AddUserRequest, UpdateUserRequest } from '../models/api/user';
import { userMapper } from '../mappers/user';
import { parserValidator } from '../controllers/parser-validator';

var router: Router = express.Router();

/**
 * Route to add a new user
 */
router.post('/users', (request, response, __) => {

	parserValidator.parseAndValidate(AddUserRequest, request.body)
		.then((body) => {

			const newUser = userMapper.apiToInternal(body.newUser);
			return userController.saveUser(newUser)
		})
		.then((savedUser) => {
		
			const body: AddUserResponse = {
				uid: savedUser._id
			};

			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot add user: ' + error);
		});
});

/**
 * Route to update an existing user
 */
router.put('/users/:id', (request, response, __) => {

	parserValidator.parseAndValidate(UpdateUserRequest, request.body)
		.then((body) => {

			const user = userMapper.apiToInternal(body.user);
			user._id = request.params.id;
			return userController.saveUser(user)
		})
		.then(() => {
		
			const body: UpdateUserResponse = {};
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot update user: ' + error);
		});
});

/**
 * Route to delete a user
 */
router.delete('/users/:id', (request, response, __) => {

	userController.deleteUser(request.params.id)
		.then(() => {
			
			const body: DeleteUserResponse = {};
			response.json(body);
		})
		.catch((error) => {

			response.status(500).send('Cannot delete user: ' + error);
		});
});

/**
 * Router for users API
 */
export const userRouter: Router = router;
