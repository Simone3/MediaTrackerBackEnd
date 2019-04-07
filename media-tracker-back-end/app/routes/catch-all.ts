
import express, { Router, Response } from 'express';
import { ErrorResponse } from '../models/api/common';
import { AppError } from '../models/error/error';
import { logger } from '../loggers/logger';

var router: Router = express.Router();

router.all('*', (_, res: Response) => {

	logger.error('Entered the catch all route, no API found');
	res.status(404).json(new ErrorResponse(AppError.NOT_FOUND));
});

/**
 * Catch-All route to handle all undefined endpoints
 */
export const catchAllRouter: Router = router;
