
import { userResourceAuthorizationMiddleware } from 'app/auth/authorization';
import { oldAppImportController } from 'app/controllers/import/old-app';
import { oldAppExportImportOptionsMapper, oldAppExportMapper } from 'app/data/mappers/import/old-app/export';
import { ImportOldAppExportRequest, ImportOldAppExportResponse } from 'app/data/models/api/import/old-app/export';
import { AppError } from 'app/data/models/error/error';
import { errorResponseFactory } from 'app/factories/error';
import { logger } from 'app/loggers/logger';
import { parserValidator } from 'app/utilities/parser-validator';
import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * Route to import the old Media Tracker app export
 */
router.post('/users/:userId/import/old-app', userResourceAuthorizationMiddleware, (request, response) => {

	const userId: string = request.params.userId;

	parserValidator.parseAndValidate(ImportOldAppExportRequest, request.body)
		.then((parsedRequest) => {

			const oldAppExport = oldAppExportMapper.toInternal(parsedRequest.export);
			const importOptions = oldAppExportImportOptionsMapper.toInternal(parsedRequest.options);

			oldAppImportController.import(userId, oldAppExport, importOptions)
				.then(() => {
			
					const responseBody: ImportOldAppExportResponse = {
						message: 'Data successfully imported'
					};

					response.json(responseBody);
				})
				.catch((error) => {

					logger.error('Import old app export generic error: %s', error);
					response.status(500).json(errorResponseFactory.from(AppError.GENERIC.withDetails(error)));
				});
		})
		.catch((error) => {

			logger.error('Import old app export request error: %s', error);
			response.status(500).json(errorResponseFactory.from(AppError.INVALID_REQUEST.withDetails(error)));
		});
});

/**
 * Route to import data in bulk
 */
export const importRouter: Router = router;
