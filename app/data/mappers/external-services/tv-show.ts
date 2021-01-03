import { config } from 'app/config/config';
import { ModelMapper } from 'app/data/mappers/common';
import { AppError } from 'app/data/models/error/error';
import { TmdbTvShowDetailsResponse, TmdbTvShowSearchResult, TmdbTvShowSeason, TmdbTvShowSeasonDataResponse } from 'app/data/models/external-services/media-items/tv-show';
import { CatalogTvShowInternal, CatalogTvShowSeasonInternal, SearchTvShowCatalogResultInternal } from 'app/data/models/internal/media-items/tv-show';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Mapper for the TV shows search external service
 */
class TvShowExternalSearchServiceMapper extends ModelMapper<SearchTvShowCatalogResultInternal, TmdbTvShowSearchResult, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): TmdbTvShowSearchResult {

		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: TmdbTvShowSearchResult): SearchTvShowCatalogResultInternal {
		
		return {
			catalogId: String(source.id),
			name: source.name,
			releaseDate: dateUtils.toDate(source.first_air_date)
		};
	}
}

/**
 * Helper type
 */
type TvShowExternalDetailsServiceMapperParams = {
	currentSeasonData: TmdbTvShowSeasonDataResponse;
};

/**
 * Mapper for the TV shows details external service
 */
class TvShowExternalDetailsServiceMapper extends ModelMapper<CatalogTvShowInternal, TmdbTvShowDetailsResponse, TvShowExternalDetailsServiceMapperParams> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): TmdbTvShowDetailsResponse {

		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: TmdbTvShowDetailsResponse, extraParams?: TvShowExternalDetailsServiceMapperParams): CatalogTvShowInternal {
		
		return {
			catalogId: String(source.id),
			name: source.name,
			genres: miscUtils.extractFilterAndSortFieldValues(source.genres, 'name'),
			description: source.overview,
			releaseDate: dateUtils.toDate(source.first_air_date),
			imageUrl: this.getFullImagePath(source.backdrop_path),
			creators: miscUtils.extractFilterAndSortFieldValues(source.created_by, 'name'),
			averageEpisodeRuntimeMinutes: this.getAverageEpisodeRuntime(source.episode_run_time),
			seasons: this.convertToInternalSeasons(source.seasons),
			inProduction: source.in_production,
			nextEpisodeAirDate: extraParams ? this.getNextEpisodeAirDate(extraParams.currentSeasonData) : undefined
		};
	}

	/**
	 * Helper to build the full image path
	 * @param backdropPath source field
	 * @returns the image URL
	 */
	private getFullImagePath(backdropPath: string | undefined): string | undefined {

		if(backdropPath) {

			return config.externalApis.theMovieDb.tvShows.imageBasePath + backdropPath;
		}
	}

	/**
	 * Helper to get the next episode air date
	 * @param currentSeasonData the current season data
	 * @returns the possibly undefined extracted air date
	 */
	private getNextEpisodeAirDate(currentSeasonData?: TmdbTvShowSeasonDataResponse): Date | undefined {

		if(currentSeasonData && currentSeasonData.episodes) {

			const now: Date = new Date();

			let nextEpisodeAirDate = '';
			for(let i = currentSeasonData.episodes.length - 1; i >= 0; i--) {

				const stringAirDate = currentSeasonData.episodes[i].air_date;
				if(stringAirDate) {

					const airDate: Date = new Date(stringAirDate);
					if(now.getTime() < airDate.getTime()) {

						nextEpisodeAirDate = stringAirDate;
					}
					else {

						break;
					}
				}
			}
			return nextEpisodeAirDate ? dateUtils.toDate(nextEpisodeAirDate) : undefined;
		}
		else {

			return undefined;
		}
	}

	/**
	 * Helper to get the average episode runtime
	 * @param runtimes all source runtimes
	 * @returns the possibly undefined average runtime
	 */
	private getAverageEpisodeRuntime(runtimes: number[] | undefined): number | undefined {

		if(runtimes && runtimes.length > 0) {

			return Math.round(runtimes.reduce((previous, current) => {
				return previous + current;
			}, 0) / runtimes.length);
		}
		
		return undefined;
	}
	
	/**
	 * Helper to map the seasons list
	 * @param source source seasons
	 * @returns target seasons
	 */
	private convertToInternalSeasons(source?: TmdbTvShowSeason[]): CatalogTvShowSeasonInternal[] | undefined {
		
		if(source) {

			return source
				.filter((sourceItem) => {

					return sourceItem.season_number && sourceItem.season_number > 0;
				})
				.map((sourceItem) => {

					return {
						number: sourceItem.season_number,
						episodesNumber: sourceItem.episode_count
					};
				});
		}
		else {

			return undefined;
		}
	}
}

/**
 * Singleton instance of TV show search external service mapper
 */
export const tvShowExternalSearchServiceMapper = new TvShowExternalSearchServiceMapper();

/**
 * Singleton instance of TV show details external service mapper
 */
export const tvShowExternalDetailsServiceMapper = new TvShowExternalDetailsServiceMapper();
