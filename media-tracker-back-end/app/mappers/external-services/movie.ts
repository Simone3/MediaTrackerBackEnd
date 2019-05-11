import { config } from 'app/config/config';
import { ModelMapper } from 'app/mappers/common';
import { AppError } from 'app/models/error/error';
import { TmdbMovieCredits, TmdbMovieDetailsResponse, TmdbMovieSearchResult } from 'app/models/external-services/media-items/movie';
import { CatalogMovieInternal, SearchMovieCatalogResultInternal } from 'app/models/internal/media-items/movie';
import { dateUtils } from 'app/utilities/date-utils';

/**
 * Mapper for the movies search external service
 */
class MovieExternalSearchServiceMapper extends ModelMapper<SearchMovieCatalogResultInternal, TmdbMovieSearchResult, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): TmdbMovieSearchResult {

		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: TmdbMovieSearchResult): SearchMovieCatalogResultInternal {
		
		return {
			catalogId: String(source.id),
			name: source.title,
			releaseDate: dateUtils.toDate(source.release_date)
		};
	}
}

/**
 * Mapper for the movies details external service
 */
class MovieExternalDetailsServiceMapper extends ModelMapper<CatalogMovieInternal, TmdbMovieDetailsResponse, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): TmdbMovieDetailsResponse {

		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: TmdbMovieDetailsResponse): CatalogMovieInternal {
		
		return {
			director: this.getDirectorName(source.credits),
			name: source.title
		};
	}

	/**
	 * Helper to get the director's name
	 */
	private getDirectorName(credits: TmdbMovieCredits | undefined): string | undefined {

		if(credits) {

			const { crew } = credits;
			
			if(crew) {

				for(const person of crew) {

					if(person && config.externalApis.theMovieDb.movies.directorJobName === person.job) {

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

