import { Schema } from "mongoose";
import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from "./media-item";

/**
 * Database schema for videogames
 */
export const VideogameSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	developer: {type: String, required: false}
}, {
	...commonMediaItemSchemaOptions
});

/**
 * Videogames collection name
 */
export const VIDEOGAME_COLLECTION_NAME = 'Videogame';