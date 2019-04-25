import { logger } from 'app/loggers/logger';
import { ErrorResponse } from 'app/models/api/common';
import { AppError } from 'app/models/error/error';
import express, { Response, Router } from 'express';

const router: Router = express.Router();

router.all('*', (_, res: Response) => {

	logger.error('Entered the catch all route, no API found');
	res.status(404).json(new ErrorResponse(AppError.NOT_FOUND));
});

/**
 * Catch-All route to handle all undefined endpoints
 */
export const catchAllRouter: Router = router;
