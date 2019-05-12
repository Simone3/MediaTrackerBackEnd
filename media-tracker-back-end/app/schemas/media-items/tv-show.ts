import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from 'app/schemas/media-items/media-item';
import { Schema } from 'mongoose';

/**
 * Database schema for TV shows
 */
export const TvShowSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	creators: { type: [ String ], required: false },
	averageEpisodeRuntimeMinutes: { type: Number, required: false },
	episodesNumber: { type: Number, required: false },
	seasonsNumber: { type: Number, required: false },
	inProduction: { type: Boolean, required: false },
	nextEpisodeAirDate: { type: Date, required: false }
}, {
	...commonMediaItemSchemaOptions
});

/**
 * TvShows collection name
 */
export const TV_SHOW_COLLECTION_NAME = 'TvShow';
