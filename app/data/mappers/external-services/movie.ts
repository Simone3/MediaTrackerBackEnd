import { config } from 'app/config/config';
import { ModelMapper } from 'app/data/mappers/common';
import { AppError } from 'app/data/models/error/error';
import { TmdbMovieCredits, TmdbMovieDetailsResponse, TmdbMovieSearchResult } from 'app/data/models/external-services/media-items/movie';
import { CatalogMovieInternal, SearchMovieCatalogResultInternal } from 'app/data/models/internal/media-items/movie';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';

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
			catalogId: String(source.id),
			name: source.title,
			genres: miscUtils.extractFilterAndSortFieldValues(source.genres, 'name'),
			description: source.overview,
			releaseDate: dateUtils.toDate(source.release_date),
			imageUrl: this.getFullImagePath(source.backdrop_path),
			directors: this.getDirectors(source.credits),
			durationMinutes: source.runtime
		};
	}

	/**
	 * Helper to build the full image path
	 * @param backdropPath source field
	 * @returns the image URL
	 */
	private getFullImagePath(backdropPath: string | undefined): string | undefined {

		if(backdropPath) {

			return config.externalApis.theMovieDb.movies.imageBasePath + backdropPath;
		}

		return undefined;
	}

	/**
	 * Helper to get the director(s)
	 * @param credits the source data
	 * @returns the list of directors or undefined if none
	 */
	private getDirectors(credits: TmdbMovieCredits | undefined): string[] | undefined {

		if(credits) {

			const { crew } = credits;
			
			if(crew) {

				const directors = [];
				for(const person of crew) {

					if(person && config.externalApis.theMovieDb.movies.directorJobName === person.job) {

						directors.push(person.name);
					}
				}
				return miscUtils.filterAndSortValues(directors);
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

