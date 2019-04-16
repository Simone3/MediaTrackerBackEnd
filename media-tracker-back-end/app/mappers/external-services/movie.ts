import { TheMovieDbSearchResult, TheMovieDbDetailsResponse, TheMovieDbCredits } from "../../models/external-services/media-items/movie";
import { SearchMovieCatalogResultInternal, CatalogMovieInternal } from "../../models/internal/media-items/movie";
import { config } from "../../config/config";
import { ModelMapper } from "../common";

/**
 * Mapper for the movies search external service
 */
class MovieExternalSearchServiceMapper extends ModelMapper<SearchMovieCatalogResultInternal, TheMovieDbSearchResult, never> {
	
	protected convertToExternal(): TheMovieDbSearchResult {

		throw "convertToExternal unimplemented"
	}

	protected convertToInternal(source: TheMovieDbSearchResult): SearchMovieCatalogResultInternal {
		
		return {
			catalogId: source.id,
			title: source.title,
			releaseDate: source.release_date
		};
	}
}

/**
 * Mapper for the movies details external service
 */
class MovieExternalDetailsServiceMapper extends ModelMapper<CatalogMovieInternal, TheMovieDbDetailsResponse, never> {

	protected convertToExternal(): TheMovieDbSearchResult {

		throw "convertToExternal unimplemented"
	}

	protected convertToInternal(source: TheMovieDbDetailsResponse): CatalogMovieInternal {
		
		return {
			director: this.getDirectorName(source.credits),
			name: source.title,
		};
	}

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
 * Singleton instance of movie search external service mapper
 */
export const movieExternalSearchServiceMapper = new MovieExternalSearchServiceMapper();

/**
 * Singleton instance of movie details external service mapper
 */
export const movieExternalDetailsServiceMapper = new MovieExternalDetailsServiceMapper();


