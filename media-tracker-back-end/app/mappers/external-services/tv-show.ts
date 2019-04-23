import { TmdbTvShowSearchResult, TmdbTvShowDetailsResponse, TmdbTvShowSeasonDataResponse, TmdbTvShowCreator } from "../../models/external-services/media-items/tv-show";
import { SearchTvShowCatalogResultInternal, CatalogTvShowInternal } from "../../models/internal/media-items/tv-show";
import { ModelMapper } from "../common";

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
			catalogId: source.id,
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
	private getCreator(creators?: TmdbTvShowCreator[]): string {

		const SEP = ', ';

		if(creators) {

			let result = '';
			for(let creator of creators) {

				if(creator && creator.name) {

					result += creator.name + SEP;
				}
			}
			return result.length > 0 ? result.slice(0, -SEP.length) : result;
		}
		else {

			return '';
		}
	}

	/**
	 * Helper to get the next episode air date
	 * @param currentSeasonData the current season data
	 */
	private getNextEpisodeAirDate(currentSeasonData?: TmdbTvShowSeasonDataResponse): string {

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
			return nextEpisodeAirDate;
		}
		else {

			return '';
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


