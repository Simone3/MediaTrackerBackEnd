import { MediaItemCatalogDetailsMapper, MediaItemCatalogSearchMapper, MediaItemFilterMapper, MediaItemMapper, MediaItemMapperParams, MediaItemSortMapper } from 'app/mappers/media-items/media-item';
import { CatalogMovie, IdentifiedMovie, MovieFilter, MovieSortBy, MovieSortField, SearchMovieCatalogResult } from 'app/models/api/media-items/movie';
import { CatalogMovieInternal, MovieFilterInternal, MovieInternal, MovieSortByInternal, MovieSortFieldInternal, SearchMovieCatalogResultInternal } from 'app/models/internal/media-items/movie';

/**
 * Mapper for movies
 */
class MovieMapper extends MediaItemMapper<MovieInternal, IdentifiedMovie> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: MovieInternal): IdentifiedMovie {

		return {
			...this.commonToExternal(source),
			uid: source._id,
			director: source.director,
			durationMinutes: source.durationMinutes
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: IdentifiedMovie, extraParams?: MediaItemMapperParams): MovieInternal {
		
		return {
			...this.commonToInternal(source, extraParams),
			_id: source.uid ? source.uid : null,
			director: source.director,
			durationMinutes: source.durationMinutes
		};
	}
}

/**
 * Mapper for movie filters
 */
class MovieFilterMapper extends MediaItemFilterMapper<MovieFilterInternal, MovieFilter> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: MovieFilterInternal): MovieFilter {
		
		return this.commonToExternal(source);
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: MovieFilter): MovieFilterInternal {
		
		return this.commonToInternal(source);
	}
}

/**
 * Mapper for movie sort options
 */
class MovieSortMapper extends MediaItemSortMapper<MovieSortByInternal, MovieSortBy> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: MovieSortByInternal): MovieSortBy {
		
		return {
			...this.commonToExternal(source),
			field: this.toExternalField(source.field)
		};
	}
		
	/**
	 * @override
	 */
	protected convertToInternal(source: MovieSortBy): MovieSortByInternal {
		
		return {
			...this.commonToInternal(source),
			field: this.toInternalField(source.field)
		};
	}
	
	/**
	 * Helper to translate the sort field enumeration
	 */
	protected toExternalField(source: MovieSortFieldInternal): string {

		switch(source) {
			
			case 'DIRECTOR': return MovieSortField.DIRECTOR;
			default: return this.commonToExternalField(source);
		}
	}
	
	/**
	 * Helper to translate the sort field enumeration
	 */
	protected toInternalField(source: string): MovieSortFieldInternal {

		switch(source) {
			
			case MovieSortField.DIRECTOR: return 'DIRECTOR';
			default: return this.commonToInternalField(source);
		}
	}
}

/**
 * Mapper for movie catalog search results
 */
class MovieCatalogSearchMapper extends MediaItemCatalogSearchMapper<SearchMovieCatalogResultInternal, SearchMovieCatalogResult> {
		
	/**
	 * @override
	 */
	protected convertToExternal(source: SearchMovieCatalogResultInternal): SearchMovieCatalogResult {

		return this.commonToExternal(source);
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: SearchMovieCatalogResult): SearchMovieCatalogResultInternal {

		return this.commonToInternal(source);
	}
}

/**
 * Mapper for movie catalog details
 */
class MovieCatalogDetailsMapper extends MediaItemCatalogDetailsMapper<CatalogMovieInternal, CatalogMovie> {
	
	/**
	 * @override
	 */
	protected convertToExternal(source: CatalogMovieInternal): CatalogMovie {

		return {
			...this.commonToExternal(source),
			director: source.director
		};
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: CatalogMovie): CatalogMovieInternal {

		return {
			...this.commonToInternal(source),
			director: source.director
		};
	}
}

/**
 * Singleton instance of the movies mapper
 */
export const movieMapper = new MovieMapper();

/**
 * Singleton instance of the movies filter mapper
 */
export const movieFilterMapper = new MovieFilterMapper();

/**
 * Singleton instance of the movies sort mapper
 */
export const movieSortMapper = new MovieSortMapper();

/**
 * Singleton instance of the movies catalog search mapper
 */
export const movieCatalogSearchMapper = new MovieCatalogSearchMapper();

/**
 * Singleton instance of the movies catalog details mapper
 */
export const movieCatalogDetailsMapper = new MovieCatalogDetailsMapper();

