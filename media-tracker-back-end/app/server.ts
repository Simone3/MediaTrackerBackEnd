import express from 'express';
import { mediaItemRouter} from './routes/media-item';
import { catchAllRouter} from './routes/catch-all';

var app = express();
app.use('/media-items', mediaItemRouter);
app.use(catchAllRouter);

/**
 * Main Express server instance, just requires a .listen() call
 */
export const server = app;
