import express from 'express';
import { catchAllRouter } from '../routes/catch-all';
import { userRouter } from '../routes/user';
import { categoryRouter } from '../routes/category';
import { logCorrelationMiddleware, requestLoggerMiddleware, responseLoggerMiddleware } from '../loggers/express-logger';
import { config } from '../config/config';
import { requestScopeContextMiddleware } from '../controllers/utilities/request-scope-context';
import { groupRouter } from '../routes/group';
import { movieEntityRouter, movieCatalogRouter } from '../routes/media-items/movie';
import { tvShowEntityRouter, tvShowCatalogRouter } from '../routes/media-items/tv-show';
import { bookEntityRouter, bookCatalogRouter } from '../routes/media-items/book';

// Base setup
var app = express();
app.use(express.json());
app.use(requestScopeContextMiddleware);

// Logging
app.use(logCorrelationMiddleware);
if(config.log.logApisInputOutput) {

	app.use(requestLoggerMiddleware);
	app.use(responseLoggerMiddleware);
}

// User, category and group routes
app.use('/', userRouter);
app.use('/', categoryRouter);
app.use('/', groupRouter);

// Media item routes
app.use('/', movieEntityRouter);
app.use('/', movieCatalogRouter);
app.use('/', tvShowEntityRouter);
app.use('/', tvShowCatalogRouter);
app.use('/', bookEntityRouter);
app.use('/', bookCatalogRouter);

// Final catch-all route
app.use(catchAllRouter);

/**
 * Main Express server instance, just requires a .listen() call
 */
export const server = app;
