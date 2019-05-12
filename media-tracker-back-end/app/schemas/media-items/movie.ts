import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from 'app/schemas/media-items/media-item';
import { Schema } from 'mongoose';

/**
 * Database schema for movies
 */
export const MovieSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	directors: { type: [ String ], required: false },
	durationMinutes: { type: Number, required: false }
}, {
	...commonMediaItemSchemaOptions
});

/**
 * Movies collection name
 */
export const MOVIE_COLLECTION_NAME = 'Movie';
