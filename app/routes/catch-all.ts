import { AppError } from 'app/data/models/error/error';
import { errorResponseFactory } from 'app/factories/error';
import { logger } from 'app/loggers/logger';
import express, { Response, Router } from 'express';

const router: Router = express.Router();

router.all('*', (_, res: Response) => {

	logger.error('Entered the catch all route, no API found');
	res.status(404).json(errorResponseFactory.from(AppError.NOT_FOUND));
});

/**
 * Catch-All route to handle all undefined endpoints
 */
export const catchAllRouter: Router = router;
