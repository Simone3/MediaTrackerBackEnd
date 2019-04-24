import { stringUtils } from "app/controllers/utilities/misc-utils";
import { ModelMapper } from "app/mappers/common";
import { TmdbTvShowCreator, TmdbTvShowDetailsResponse, TmdbTvShowSearchResult, TmdbTvShowSeasonDataResponse } from "app/models/external-services/media-items/tv-show";
import { CatalogTvShowInternal, SearchTvShowCatalogResultInternal } from "app/models/internal/media-items/tv-show";

/**
 * Mapper for the TV shows search external service
 */
class TvShowExternalSearchServiceMapper extends ModelMapper<SearchTvShowCatalogResultInternal, TmdbTvShowSearchResult, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): TmdbTvShowSearchResult {

		throw "convertToExternal unimplemented"
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: TmdbTvShowSearchResult): SearchTvShowCatalogResultInternal {
		
		return {
			catalogId: String(source.id),
			title: source.name,
			releaseDate: source.first_air_date
		};
	}
}

/**
 * Helper type
 */
type TvShowExternalDetailsServiceMapperParams = {
	currentSeasonData: TmdbTvShowSeasonDataResponse
};

/**
 * Mapper for the TV shows details external service
 */
class TvShowExternalDetailsServiceMapper extends ModelMapper<CatalogTvShowInternal, TmdbTvShowDetailsResponse, TvShowExternalDetailsServiceMapperParams> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): TmdbTvShowDetailsResponse {

		throw "convertToExternal unimplemented"
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: TmdbTvShowDetailsResponse, extraParams?: TvShowExternalDetailsServiceMapperParams): CatalogTvShowInternal {
		
		return {
			name: source.name,
			creator: this.getCreator(source.created_by),
			nextEpisodeAirDate: extraParams ? this.getNextEpisodeAirDate(extraParams.currentSeasonData) : undefined
		};
	}
	
	/**
	 * Helper to build the creators list
	 * @param creators the optional creators array
	 */
	private getCreator(creators?: TmdbTvShowCreator[]): string | undefined {

		return stringUtils.join(creators, ', ', undefined, ['name']);
	}

	/**
	 * Helper to get the next episode air date
	 * @param currentSeasonData the current season data
	 */
	private getNextEpisodeAirDate(currentSeasonData?: TmdbTvShowSeasonDataResponse): string | undefined {

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
			return nextEpisodeAirDate ? nextEpisodeAirDate : undefined;
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


