import { Schema } from "mongoose";
import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from "./media-item";

/**
 * Database schema for movies
 */
export const MovieSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	director: {type: String, required: false}
}, {
	...commonMediaItemSchemaOptions
});

/**
 * Movies collection name
 */
export const MOVIE_COLLECTION_NAME = 'Movie';