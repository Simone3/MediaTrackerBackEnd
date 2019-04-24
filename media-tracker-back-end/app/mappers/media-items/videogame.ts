import { MediaItemCatalogDetailsMapper, MediaItemCatalogSearchMapper, MediaItemFilterMapper, MediaItemMapper, MediaItemMapperParams, MediaItemSortMapper } from 'app/mappers/media-items/media-item';
import { CatalogVideogame, IdentifiedVideogame, SearchVideogameCatalogResult, VideogameFilter, VideogameSortBy, VideogameSortField } from 'app/models/api/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal, VideogameFilterInternal, VideogameInternal, VideogameSortByInternal, VideogameSortFieldInternal } from 'app/models/internal/media-items/videogame';

/**
 * Mapper for videogames
 */
class VideogameMapper extends MediaItemMapper<VideogameInternal, IdentifiedVideogame> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: VideogameInternal): IdentifiedVideogame {

		return {
			...this.commonToExternal(source),
			uid: source._id,
			developer: source.developer
		}
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedVideogame, extraParams?: MediaItemMapperParams): VideogameInternal {
		
		return {
			...this.commonToInternal(source, extraParams),
			_id: (source.uid ? source.uid : null),
			developer: source.developer
		}
	}
}

/**
 * Mapper for videogame filters
 */
class VideogameFilterMapper extends MediaItemFilterMapper<VideogameFilterInternal, VideogameFilter> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: VideogameFilterInternal): VideogameFilter {
		
		return this.commonToExternal(source);
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: VideogameFilter): VideogameFilterInternal {
		
		return this.commonToInternal(source);
	}
}

/**
 * Mapper for videogame sort options
 */
class VideogameSortMapper extends MediaItemSortMapper<VideogameSortByInternal, VideogameSortBy> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: VideogameSortByInternal): VideogameSortBy {
		
		return {
			...this.commonToExternal(source),
			field: this.toExternalField(source.field)
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: VideogameSortBy): VideogameSortByInternal {
		
		return {
			...this.commonToInternal(source),
			field: this.toInternalField(source.field)
		};
	}
	
	/**
	 * Helper to translate the sort field enumeration
	 */
	protected toExternalField(source: VideogameSortFieldInternal): string {

		switch(source) {
			
			case 'DEVELOPER': return VideogameSortField.DEVELOPER;
			default: return this.commonToExternalField(source);
		}
	}
	
	/**
	 * Helper to translate the sort field enumeration
	 */
	protected toInternalField(source: string): VideogameSortFieldInternal {

		switch(source) {
			
			case VideogameSortField.DEVELOPER: return 'DEVELOPER';
			default: return this.commonToInternalField(source);
		}
	}
}

/**
 * Mapper for videogame catalog search results
 */
class VideogameCatalogSearchMapper extends MediaItemCatalogSearchMapper<SearchVideogameCatalogResultInternal, SearchVideogameCatalogResult> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: SearchVideogameCatalogResultInternal): SearchVideogameCatalogResult {

		return this.commonToExternal(source);
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: SearchVideogameCatalogResult): SearchVideogameCatalogResultInternal {

		return this.commonToInternal(source);
	}
}

/**
 * Mapper for videogame catalog details
 */
class VideogameCatalogDetailsMapper extends MediaItemCatalogDetailsMapper<CatalogVideogameInternal, CatalogVideogame> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: CatalogVideogameInternal): CatalogVideogame {

		return {
			...this.commonToExternal(source),
			developer: source.developer
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: CatalogVideogame): CatalogVideogameInternal {

		return {
			...this.commonToInternal(source),
			developer: source.developer
		};
	}
}

/**
 * Singleton instance of the videogames mapper
 */
export const videogameMapper = new VideogameMapper();

/**
 * Singleton instance of the videogames filter mapper
 */
export const videogameFilterMapper = new VideogameFilterMapper();

/**
 * Singleton instance of the videogames sort mapper
 */
export const videogameSortMapper = new VideogameSortMapper();

/**
 * Singleton instance of the videogames catalog search mapper
 */
export const videogameCatalogSearchMapper = new VideogameCatalogSearchMapper();

/**
 * Singleton instance of the videogames catalog details mapper
 */
export const videogameCatalogDetailsMapper = new VideogameCatalogDetailsMapper();








