import { Schema } from "mongoose";
import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from "./media-item";

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