import { authenticationMiddleware } from 'app/auth/authentication';
import { config } from 'app/config/config';
import { logCorrelationMiddleware, requestLoggerMiddleware, responseLoggerMiddleware } from 'app/loggers/express-logger';
import { catchAllRouter } from 'app/routes/catch-all';
import { categoryRouter } from 'app/routes/category';
import { groupRouter } from 'app/routes/group';
import { bookCatalogRouter, bookEntityRouter } from 'app/routes/media-items/book';
import { movieCatalogRouter, movieEntityRouter } from 'app/routes/media-items/movie';
import { tvShowCatalogRouter, tvShowEntityRouter } from 'app/routes/media-items/tv-show';
import { videogameCatalogRouter, videogameEntityRouter } from 'app/routes/media-items/videogame';
import { ownPlatformRouter } from 'app/routes/own-platform';
import { requestScopeContextMiddleware } from 'app/utilities/request-scope-context';
import express from 'express';

// Base setup
const app = express();
app.use(express.json());
app.use(requestScopeContextMiddleware);
app.use(authenticationMiddleware);

// Logging
app.use(logCorrelationMiddleware);
if(config.log.logApisInputOutput) {

	app.use(requestLoggerMiddleware);
	app.use(responseLoggerMiddleware);
}

// User, category and group routes
app.use('/', categoryRouter);
app.use('/', groupRouter);
app.use('/', ownPlatformRouter);

// Media item routes
app.use('/', movieEntityRouter);
app.use('/', movieCatalogRouter);
app.use('/', tvShowEntityRouter);
app.use('/', tvShowCatalogRouter);
app.use('/', bookEntityRouter);
app.use('/', bookCatalogRouter);
app.use('/', videogameEntityRouter);
app.use('/', videogameCatalogRouter);

// Final catch-all route
app.use(catchAllRouter);

/**
 * Main Express server instance, just requires a .listen() call
 */
export const server = app;
