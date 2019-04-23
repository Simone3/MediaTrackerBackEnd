import { MediaItemMapper, MediaItemMapperParams, MediaItemFilterMapper, MediaItemSortMapper, MediaItemCatalogSearchMapper, MediaItemCatalogDetailsMapper } from "./media-item";
import { TvShowInternal, TvShowFilterInternal, TvShowSortByInternal, TvShowSortFieldInternal, SearchTvShowCatalogResultInternal, CatalogTvShowInternal } from "../../models/internal/media-items/tv-show";
import { IdentifiedTvShow, TvShowFilter, TvShowSortBy, TvShowSortField, SearchTvShowCatalogResult, CatalogTvShow } from "../../models/api/media-items/tv-show";

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
			creator: source.creator
		}
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedTvShow, extraParams?: MediaItemMapperParams): TvShowInternal {
		
		return {
			...this.commonToInternal(source, extraParams),
			_id: (source.uid ? source.uid : null),
			creator: source.creator
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
	 */
	protected toExternalField(source: TvShowSortFieldInternal): string {

		switch(source) {
			
			case 'CREATOR': return TvShowSortField.CREATOR;
			default: return this.commonToExternalField(source);
		}
	}
	
	/**
	 * Helper to translate the sort field enumeration
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
			creator: source.creator,
			nextEpisodeAirDate: source.nextEpisodeAirDate
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: CatalogTvShow): CatalogTvShowInternal {

		return {
			...this.commonToInternal(source),
			creator: source.creator,
			nextEpisodeAirDate: source.nextEpisodeAirDate
		};
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








