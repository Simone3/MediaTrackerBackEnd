import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from "app/schemas/media-items/media-item";
import { Schema } from "mongoose";

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