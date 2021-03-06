import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from 'app/schemas/media-items/media-item';
import { Schema } from 'mongoose';

/**
 * Database schema for videogames
 */
export const VideogameSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	developers: { type: [ String ], required: false },
	publishers: { type: [ String ], required: false },
	platforms: { type: [ String ], required: false },
	averageLengthHours: { type: Number, required: false }
}, {
	...commonMediaItemSchemaOptions
});

/**
 * Videogames collection name
 */
export const VIDEOGAME_COLLECTION_NAME = 'Videogame';
