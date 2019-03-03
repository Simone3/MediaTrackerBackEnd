
import express, { Router, Response } from 'express';
import { getAllMediaItems } from '../actions/media-item';

var router: Router = express.Router();

router.get('/', (_, response: Response, __) => {

	response.json(getAllMediaItems());
});

/**
 * Router for media items API
 */
export const mediaItemRouter: Router = router;
