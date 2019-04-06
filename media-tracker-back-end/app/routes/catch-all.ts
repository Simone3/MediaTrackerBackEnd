
import express, { Router, Response } from 'express';
import { ErrorResponse } from '../models/api/common';
import { AppError } from '../models/error/error';

var router: Router = express.Router();

router.all('*', (_, res: Response) => {

	res.status(404).json(new ErrorResponse(AppError.NOT_FOUND));
});

/**
 * Catch-All route to handle all undefined endpoints
 */
export const catchAllRouter: Router = router;
