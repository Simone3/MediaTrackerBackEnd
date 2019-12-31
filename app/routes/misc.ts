
import express, { Router } from 'express';

const router: Router = express.Router();

/**
 * Route to get a simple response from server to check its status
 */
router.get('/status', (_, response) => {

	response.status(200).json({
		status: 'Running'
	});
});

/**
 * Router for categories API
 */
export const miscRouter: Router = router;
