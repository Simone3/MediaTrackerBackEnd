import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { commonMediaItemSchemaDefinition, commonMediaItemSchemaOptions } from 'app/schemas/media-items/media-item';
import { Schema, ValidateOpts } from 'mongoose';

/**
 * Validator for the array of TV show seasons
 */
const tvShowSeasonsValidator: ValidateOpts<TvShowSeasonInternal[] | undefined> = {

	validator: (seasons: TvShowSeasonInternal[] | undefined): boolean => {

		if(seasons) {

			for(let i = 0; i < seasons.length; i++) {

				const season = seasons[i];

				if(!season || !season.number || season.number <= 0) {

					return false;
				}

				if(i > 0 && seasons[i - 1].number >= season.number) {

					return false;
				}
			}
		}
		
		return true;
	},

	message: () => {
		
		return 'TV show season numbers must be positive integers, unique and ordered';
	}
};

/**
 * Database schema for TV shows
 */
export const TvShowSchema: Schema = new Schema({
	...commonMediaItemSchemaDefinition,
	creators: { type: [ String ], required: false },
	averageEpisodeRuntimeMinutes: { type: Number, required: false },
	seasons: {
		type: [{
			number: { type: Number, required: true },
			episodesNumber: { type: Number, required: false },
			watchedEpisodesNumber: { type: Number, required: false }
		}],
		required: false,
		validate: tvShowSeasonsValidator
	},
	inProduction: { type: Boolean, required: false },
	nextEpisodeAirDate: { type: Date, required: false }
}, {
	...commonMediaItemSchemaOptions
});

/**
 * TvShows collection name
 */
export const TV_SHOW_COLLECTION_NAME = 'TvShow';
