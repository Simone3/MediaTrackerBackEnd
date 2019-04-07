import express from 'express';
import { mediaItemRouter } from './routes/media-item';
import { catchAllRouter } from './routes/catch-all';
import { userRouter } from './routes/user';
import { categoryRouter } from './routes/category';
import { expressRequestLogger, expressResponseLogger } from './loggers/express-logger';
import { config } from './config/config';

// Base setup
var app = express();
app.use(express.json());

// Logging
if(config.log.logApisInputOutput) {
	
	app.use(expressRequestLogger);
	app.use(expressResponseLogger);
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
