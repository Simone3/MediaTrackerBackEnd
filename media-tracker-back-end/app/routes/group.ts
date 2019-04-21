
import express, { Router } from 'express';
import { groupController } from '../controllers/entities/group';
import { GetAllGroupsResponse, AddGroupResponse, UpdateGroupResponse, DeleteGroupResponse, AddGroupRequest, UpdateGroupRequest } from '../models/api/group';
import { groupMapper } from '../mappers/group';
import { parserValidator } from '../controllers/utilities/parser-validator';
import { ErrorResponse } from '../models/api/common';
import { AppError } from '../models/error/error';
import { logger } from '../loggers/logger';
import { miscUtilsController } from '../controllers/utilities/misc-utils';

var router: Router = express.Router();

/**
 * Route to get all saved groups
 */
router.get('/users/:userId/categories/:categoryId/groups', (request, response, __) => {

	const {
		userId,
		categoryId
	} = request.params;

	groupController.getAllGroups(userId, categoryId)
		.then((groups) => {

			const body: GetAllGroupsResponse = {
				groups: groupMapper.toExternalList(groups)
			};
			
			response.json(body);
		})
		.catch((error) => {

			logger.error('Get groups generic error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
		});
});

/**
 * Route to add a new group
 */
router.post('/users/:userId/categories/:categoryId/groups', (request, response, __) => {

	const {
		userId,
		categoryId
	} = request.params;

	parserValidator.parseAndValidate(AddGroupRequest, request.body)
		.then((body) => {

			const newGroup = groupMapper.toInternal({...body.newGroup, uid: ""}, {userId, categoryId});
			groupController.saveGroup(newGroup, body.allowSameName)
				.then(() => {
			
					const body: AddGroupResponse = {
						message: 'Group successfully added'
					};

					response.json(body);
				})
				.catch((error) => {

					logger.error('Add group generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
				});
		})
		.catch((error) => {

			logger.error('Add group request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
		});
});

/**
 * Route to update an existing group
 */
router.put('/users/:userId/categories/:categoryId/groups/:id', (request, response, __) => {

	const {
		userId,
		categoryId,
		id
	} = request.params;

	parserValidator.parseAndValidate(UpdateGroupRequest, request.body)
		.then((body) => {

			const group = groupMapper.toInternal({...body.group, uid: id}, {userId, categoryId});
			groupController.saveGroup(group, body.allowSameName)
			.then(() => {
			
				const body: UpdateGroupResponse = {
					message: 'Group successfully updated'
				};

				response.json(body);
			})
			.catch((error) => {

				logger.error('Update group generic error: %s', error);
				response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
			});
		})
		.catch((error) => {

			logger.error('Update group request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.unlessAppError(error)));
		});
});

/**
 * Route to delete a group
 */
router.delete('/users/:userId/categories/:categoryId/groups/:id', (request, response, __) => {

	const {
		userId,
		categoryId,
		id
	} = request.params;
	
	const forceEvenIfNotEmpty = miscUtilsController.parseBoolean(request.query.forceEvenIfNotEmpty);

	groupController.deleteGroup(userId, categoryId, id, forceEvenIfNotEmpty)
		.then(() => {
			
			const body: DeleteGroupResponse = {
				message: 'Group successfully deleted'
			};

			response.json(body);
		})
		.catch((error) => {

			logger.error('Delete group generic error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.GENERIC.unlessAppError(error)));
		});
});

/**
 * Router for groups API
 */
export const groupRouter: Router = router;
