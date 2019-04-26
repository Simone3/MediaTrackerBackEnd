
import { groupController } from 'app/controllers/entities/group';
import { miscUtils } from 'app/controllers/utilities/misc-utils';
import { parserValidator } from 'app/controllers/utilities/parser-validator';
import { logger } from 'app/loggers/logger';
import { groupMapper } from 'app/mappers/group';
import { ErrorResponse } from 'app/models/api/common';
import { AddGroupRequest, AddGroupResponse, DeleteGroupResponse, GetAllGroupsResponse, UpdateGroupRequest, UpdateGroupResponse } from 'app/models/api/group';
import { AppError } from 'app/models/error/error';
import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * Route to get all saved groups
 */
router.get('/users/:userId/categories/:categoryId/groups', (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;

	groupController.getAllGroups(userId, categoryId)
		.then((groups) => {

			const responseBody: GetAllGroupsResponse = {
				groups: groupMapper.toExternalList(groups)
			};
			
			response.json(responseBody);
		})
		.catch((error) => {

			logger.error('Get groups generic error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Route to add a new group
 */
router.post('/users/:userId/categories/:categoryId/groups', (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;

	parserValidator.parseAndValidate(AddGroupRequest, request.body)
		.then((parsedRequest) => {

			const newGroup = groupMapper.toInternal({ ...parsedRequest.newGroup, uid: '' }, { userId, categoryId });
			groupController.saveGroup(newGroup, parsedRequest.allowSameName)
				.then(() => {
			
					const responseBody: AddGroupResponse = {
						message: 'Group successfully added'
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Add group generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Add group request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to update an existing group
 */
router.put('/users/:userId/categories/:categoryId/groups/:id', (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;
	const id: string = request.params.id;

	parserValidator.parseAndValidate(UpdateGroupRequest, request.body)
		.then((parsedRequest) => {

			const group = groupMapper.toInternal({ ...parsedRequest.group, uid: id }, { userId, categoryId });
			groupController.saveGroup(group, parsedRequest.allowSameName)
				.then(() => {
				
					const responseBody: UpdateGroupResponse = {
						message: 'Group successfully updated'
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Update group generic error: %s', error);
					response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Update group request error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to delete a group
 */
router.delete('/users/:userId/categories/:categoryId/groups/:id', (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;
	const id: string = request.params.id;
	
	const forceEvenIfNotEmpty = miscUtils.parseBoolean(request.query.forceEvenIfNotEmpty);

	groupController.deleteGroup(userId, categoryId, id, forceEvenIfNotEmpty)
		.then(() => {
			
			const responseBody: DeleteGroupResponse = {
				message: 'Group successfully deleted'
			};

			response.json(responseBody);
		})
		.catch((error) => {

			logger.error('Delete group generic error: %s', error);
			response.status(500).json(new ErrorResponse(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Router for groups API
 */
export const groupRouter: Router = router;
