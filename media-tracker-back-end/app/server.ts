import express from 'express';
import { mediaItemRouter } from './routes/media-item';
import { catchAllRouter } from './routes/catch-all';
import { userRouter } from './routes/user';
import { categoryRouter } from './routes/category';

// Base setup
var app = express();
app.use(express.json());

// Routes
app.use('/', userRouter);
app.use('/', categoryRouter);
app.use('/', mediaItemRouter);
app.use(catchAllRouter);

/**
 * Main Express server instance, just requires a .listen() call
 */
export const server = app;
