import { TheMovieDbSearchResult, TheMovieDbDetailsResponse, TheMovieDbCredits } from "../models/external_services/movies";
import { SearchMediaItemCatalogResultInternal, CatalogMediaItemInternal } from "../models/internal/media-item";
import { config } from "../config/config.sample";

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
			catalogId: source.id,
			title: source.title,
			releaseDate: source.release_date
		};
	}

	/**
	 * External model to internal model
	 */
	public toInternalMediaItem(response: TheMovieDbDetailsResponse): CatalogMediaItemInternal {
		
		return {
			author: this.getDirectorName(response.credits),
			name: response.title,
		};
	}

	/**
	 * Helper to extract the director among the crew people
	 */
	private getDirectorName(credits: TheMovieDbCredits | undefined): string | undefined {

		if(credits) {

			let {crew} = credits;
			
            if(crew) {

                for(let person of crew) {

                    if(person && config.externalApis.theMovieDb.directorJobName === person.job) {

                        return person.name;
                    }
                }
            }
		}
		return undefined;
	}
}

/**
 * Singleton instance of TheMovieDB mapper
 */
export const theMovieDbMapper = new TheMovieDbMapper();


