import { MediaItemCatalogDetailsMapper, MediaItemCatalogSearchMapper, MediaItemFilterMapper, MediaItemMapper, MediaItemMapperParams, MediaItemSortMapper } from 'app/data/mappers/media-items/media-item';
import { CatalogTvShow, CatalogTvShowSeason, IdentifiedTvShow, SearchTvShowCatalogResult, TvShowFilter, TvShowSeason, TvShowSortBy, TvShowSortField } from 'app/data/models/api/media-items/tv-show';
import { CatalogTvShowInternal, CatalogTvShowSeasonInternal, SearchTvShowCatalogResultInternal, TvShowFilterInternal, TvShowInternal, TvShowSeasonInternal, TvShowSortByInternal, TvShowSortFieldInternal } from 'app/data/models/internal/media-items/tv-show';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Mapper for TV shows
 */
class TvShowMapper extends MediaItemMapper<TvShowInternal, IdentifiedTvShow> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: TvShowInternal): IdentifiedTvShow {

		return {
			...this.commonToExternal(source),
			uid: source._id,
			creators: source.creators,
			averageEpisodeRuntimeMinutes: source.averageEpisodeRuntimeMinutes,
			seasons: this.convertToExternalSeasons(source.seasons),
			inProduction: miscUtils.parseBoolean(source.inProduction),
			nextEpisodeAirDate: dateUtils.toString(source.nextEpisodeAirDate)
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedTvShow, extraParams?: MediaItemMapperParams): TvShowInternal {
		
		return {
			...this.commonToInternal(source, extraParams),
			_id: source.uid ? source.uid : null,
			creators: source.creators,
			averageEpisodeRuntimeMinutes: source.averageEpisodeRuntimeMinutes,
			seasons: this.convertToInternalSeasons(source.seasons),
			inProduction: miscUtils.parseBoolean(source.inProduction),
			nextEpisodeAirDate: dateUtils.toDate(source.nextEpisodeAirDate)
		};
	}
	
	/**
	 * Helper to map the seasons list
	 * @param source source seasons
	 * @returns target seasons
	 */
	private convertToExternalSeasons(source?: TvShowSeasonInternal[]): TvShowSeason[] | undefined {
		
		if(source) {

			return source.map((sourceItem) => {

				return {
					number: sourceItem.number,
					episodesNumber: sourceItem.episodesNumber,
					watchedEpisodesNumber: sourceItem.watchedEpisodesNumber
				};
			});
		}
		else {

			return undefined;
		}
	}
	
	/**
	 * Helper to map the seasons list
	 * @param source source seasons
	 * @returns target seasons
	 */
	private convertToInternalSeasons(source?: TvShowSeason[]): TvShowSeasonInternal[] | undefined {
		
		if(source) {

			return source.map((sourceItem) => {

				return {
					number: sourceItem.number,
					episodesNumber: sourceItem.episodesNumber,
					watchedEpisodesNumber: sourceItem.watchedEpisodesNumber
				};
			});
		}
		else {

			return undefined;
		}
	}
}

/**
 * Mapper for TV show filters
 */
class TvShowFilterMapper extends MediaItemFilterMapper<TvShowFilterInternal, TvShowFilter> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: TvShowFilterInternal): TvShowFilter {
		
		return this.commonToExternal(source);
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: TvShowFilter): TvShowFilterInternal {
		
		return this.commonToInternal(source);
	}
}

/**
 * Mapper for TV show sort options
 */
class TvShowSortMapper extends MediaItemSortMapper<TvShowSortByInternal, TvShowSortBy> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: TvShowSortByInternal): TvShowSortBy {
		
		return {
			...this.commonToExternal(source),
			field: this.toExternalField(source.field)
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: TvShowSortBy): TvShowSortByInternal {
		
		return {
			...this.commonToInternal(source),
			field: this.toInternalField(source.field)
		};
	}
	
	/**
	 * Helper to translate the sort field enumeration
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected toExternalField(source: TvShowSortFieldInternal): string {

		switch(source) {
			
			case 'CREATOR': return TvShowSortField.CREATOR;
			default: return this.commonToExternalField(source);
		}
	}
	
	/**
	 * Helper to translate the sort field enumeration
	 * @param source the mapping source
	 * @returns the mapping target
	 */
	protected toInternalField(source: string): TvShowSortFieldInternal {

		switch(source) {
			
			case TvShowSortField.CREATOR: return 'CREATOR';
			default: return this.commonToInternalField(source);
		}
	}
}

/**
 * Mapper for TV show catalog search results
 */
class TvShowCatalogSearchMapper extends MediaItemCatalogSearchMapper<SearchTvShowCatalogResultInternal, SearchTvShowCatalogResult> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: SearchTvShowCatalogResultInternal): SearchTvShowCatalogResult {

		return this.commonToExternal(source);
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: SearchTvShowCatalogResult): SearchTvShowCatalogResultInternal {

		return this.commonToInternal(source);
	}
}

/**
 * Mapper for TV show catalog details
 */
class TvShowCatalogDetailsMapper extends MediaItemCatalogDetailsMapper<CatalogTvShowInternal, CatalogTvShow> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: CatalogTvShowInternal): CatalogTvShow {

		return {
			...this.commonToExternal(source),
			creators: source.creators,
			averageEpisodeRuntimeMinutes: source.averageEpisodeRuntimeMinutes,
			seasons: this.convertToExternalSeasons(source.seasons),
			inProduction: miscUtils.parseBoolean(source.inProduction),
			nextEpisodeAirDate: dateUtils.toString(source.nextEpisodeAirDate)
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: CatalogTvShow): CatalogTvShowInternal {

		return {
			...this.commonToInternal(source),
			creators: source.creators,
			averageEpisodeRuntimeMinutes: source.averageEpisodeRuntimeMinutes,
			seasons: this.convertToInternalSeasons(source.seasons),
			inProduction: miscUtils.parseBoolean(source.inProduction),
			nextEpisodeAirDate: dateUtils.toDate(source.nextEpisodeAirDate)
		};
	}
	
	/**
	 * Helper to map the seasons list
	 * @param source source seasons
	 * @returns target seasons
	 */
	private convertToExternalSeasons(source?: CatalogTvShowSeasonInternal[]): CatalogTvShowSeason[] | undefined {
		
		if(source) {

			return source.map((sourceItem) => {

				return {
					number: sourceItem.number,
					episodesNumber: sourceItem.episodesNumber
				};
			});
		}
		else {

			return undefined;
		}
	}
	
	/**
	 * Helper to map the seasons list
	 * @param source source seasons
	 * @returns target seasons
	 */
	private convertToInternalSeasons(source?: CatalogTvShowSeason[]): CatalogTvShowSeasonInternal[] | undefined {
		
		if(source) {

			return source.map((sourceItem) => {

				return {
					number: sourceItem.number,
					episodesNumber: sourceItem.episodesNumber
				};
			});
		}
		else {

			return undefined;
		}
	}
}

/**
 * Singleton instance of the TV shows mapper
 */
export const tvShowMapper = new TvShowMapper();

/**
 * Singleton instance of the TV shows filter mapper
 */
export const tvShowFilterMapper = new TvShowFilterMapper();

/**
 * Singleton instance of the TV shows sort mapper
 */
export const tvShowSortMapper = new TvShowSortMapper();

/**
 * Singleton instance of the TV shows catalog search mapper
 */
export const tvShowCatalogSearchMapper = new TvShowCatalogSearchMapper();

/**
 * Singleton instance of the TV shows catalog details mapper
 */
export const tvShowCatalogDetailsMapper = new TvShowCatalogDetailsMapper();

