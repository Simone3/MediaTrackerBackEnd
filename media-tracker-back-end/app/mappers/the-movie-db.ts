import { TheMovieDbSearchResult } from "../models/external_services/movies";
import { SearchMediaItemCatalogResultInternal } from "../models/internal/media-item";

/**
 * Helper class to translate between external (TheMovieDB) and internal media item models
 */
class TheMovieDbMapper {

	/**
	 * List of external models to list of internal models
	 */
	public toInternalCatalogSearchResultList(sources: TheMovieDbSearchResult[]): SearchMediaItemCatalogResultInternal[] {

		return sources.map((source) => {

			return this.toInternalCatalogSearchResult(source);
		});
	}

	/**
	 * External model to internal model
	 */
	public toInternalCatalogSearchResult(source: TheMovieDbSearchResult): SearchMediaItemCatalogResultInternal {
		
		return {
			apiId: source.id,
			title: source.title,
			releaseDate: source.release_date
		};
	}
}

/**
 * Singleton instance of TheMovieDB mapper
 */
export const theMovieDbMapper = new TheMovieDbMapper();


