
import express, { Router, Response } from 'express';

var router: Router = express.Router();

router.all('*', (_, res: Response) => {

	res.status(404)
		.send({message: 'Not found'});
});

/**
 * Catch-All route to handle all undefined endpoints
 */
export const catchAllRouter: Router = router;
