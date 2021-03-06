
import { userResourceAuthorizationMiddleware } from 'app/auth/authorization';
import { groupController } from 'app/controllers/entities/group';
import { groupFilterMapper, groupMapper } from 'app/data/mappers/group';
import { AddGroupRequest, AddGroupResponse, DeleteGroupResponse, FilterGroupsRequest, FilterGroupsResponse, GetAllGroupsResponse, UpdateGroupRequest, UpdateGroupResponse } from 'app/data/models/api/group';
import { AppError } from 'app/data/models/error/error';
import { errorResponseFactory } from 'app/factories/error';
import { logger } from 'app/loggers/logger';
import { parserValidator } from 'app/utilities/parser-validator';
import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * Route to get all saved groups
 */
router.get('/users/:userId/categories/:categoryId/groups', userResourceAuthorizationMiddleware, (request, response) => {

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
			response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Route to get all saved groups matching some filter
 */
router.post('/users/:userId/categories/:categoryId/groups/filter', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;

	parserValidator.parseAndValidate(FilterGroupsRequest, request.body)
		.then((parsedRequest) => {

			const filterBy = parsedRequest.filter ? groupFilterMapper.toInternal(parsedRequest.filter) : undefined;
			groupController.filterGroups(userId, categoryId, filterBy)
				.then((groups) => {
		
					const responseBody: FilterGroupsResponse = {
						groups: groupMapper.toExternalList(groups)
					};
					
					response.json(responseBody);
				})
				.catch((error) => {
		
					logger.error('Filter groups generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Filter groups request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to add a new group
 */
router.post('/users/:userId/categories/:categoryId/groups', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;

	parserValidator.parseAndValidate(AddGroupRequest, request.body)
		.then((parsedRequest) => {

			const newGroup = groupMapper.toInternal({ ...parsedRequest.newGroup, uid: '' }, { userId, categoryId });
			groupController.saveGroup(newGroup)
				.then((savedGroup) => {
			
					const responseBody: AddGroupResponse = {
						message: 'Group successfully added',
						uid: savedGroup._id
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Add group generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Add group request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to update an existing group
 */
router.put('/users/:userId/categories/:categoryId/groups/:id', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;
	const id: string = request.params.id;

	parserValidator.parseAndValidate(UpdateGroupRequest, request.body)
		.then((parsedRequest) => {

			const group = groupMapper.toInternal({ ...parsedRequest.group, uid: id }, { userId, categoryId });
			groupController.saveGroup(group)
				.then(() => {
				
					const responseBody: UpdateGroupResponse = {
						message: 'Group successfully updated'
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Update group generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Update group request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to delete a group
 */
router.delete('/users/:userId/categories/:categoryId/groups/:id', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;
	const categoryId: string = request.params.categoryId;
	const id: string = request.params.id;
	
	groupController.deleteGroup(userId, categoryId, id)
		.then(() => {
			
			const responseBody: DeleteGroupResponse = {
				message: 'Group successfully deleted'
			};

			response.json(responseBody);
		})
		.catch((error) => {

			logger.error('Delete group generic error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
		});
});

/**
 * Router for groups API
 */
export const groupRouter: Router = router;
