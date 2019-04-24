import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from "app/schemas/media-items/media-item";
import { Schema } from "mongoose";

/**
 * Database schema for TV shows
 */
export const TvShowSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	creator: {type: String, required: false}
}, {
	...commonMediaItemSchemaOptions
});

/**
 * TvShows collection name
 */
export const TV_SHOW_COLLECTION_NAME = 'TvShow';