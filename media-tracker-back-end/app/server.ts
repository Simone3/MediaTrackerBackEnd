import express from 'express';
import { mediaItemRouter } from './routes/media-item';
import { catchAllRouter } from './routes/catch-all';
import { userRouter } from './routes/user';
import { categoryRouter } from './routes/category';
import { logCorrelationMiddleware, requestLoggerMiddleware, responseLoggerMiddleware } from './loggers/express-logger';
import { config } from './config/config';
import { requestScopeContextMiddleware } from './controllers/utilities/request-scope-context';

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

// Routes
app.use('/', userRouter);
app.use('/', categoryRouter);
app.use('/', mediaItemRouter);
app.use(catchAllRouter);

/**
 * Main Express server instance, just requires a .listen() call
 */
export const server = app;
