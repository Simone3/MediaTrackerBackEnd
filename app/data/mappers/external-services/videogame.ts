import { ModelMapper } from 'app/data/mappers/common';
import { AppError } from 'app/data/models/error/error';
import { GiantBombDetailsResponse, GiantBombDetailsResult, GiantBombImage, GiantBombSearchResult } from 'app/data/models/external-services/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal } from 'app/data/models/internal/media-items/videogame';
import { dateUtils } from 'app/utilities/date-utils';
import { miscUtils } from 'app/utilities/misc-utils';

/**
 * Helper to get the release date from the videogame data
 * @param gameData the game data
 * @returns the release date as a string or undefined
 */
const getReleaseDate = (gameData: GiantBombSearchResult | GiantBombDetailsResult): Date | undefined => {

	if(gameData.expected_release_year) {

		return dateUtils.dateFromYearMonthDay(gameData.expected_release_year, gameData.expected_release_month, gameData.expected_release_day);
	}
	else if(gameData.original_release_date) {

		return dateUtils.toDate(gameData.original_release_date);
	}
	else {

		return undefined;
	}
};

/**
 * Mapper for the videogames search external service
 */
class VideogameExternalSearchServiceMapper extends ModelMapper<SearchVideogameCatalogResultInternal, GiantBombSearchResult, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): GiantBombSearchResult {

		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: GiantBombSearchResult): SearchVideogameCatalogResultInternal {
		
		return {
			catalogId: String(source.id),
			name: source.name,
			releaseDate: getReleaseDate(source)
		};
	}
}

/**
 * Mapper for the videogames details external service
 */
class VideogameExternalDetailsServiceMapper extends ModelMapper<CatalogVideogameInternal, GiantBombDetailsResponse, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): GiantBombDetailsResponse {

		throw AppError.GENERIC.withDetails('convertToExternal unimplemented');
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: GiantBombDetailsResponse): CatalogVideogameInternal {
		
		return {
			catalogId: String(source.results.id),
			name: source.results.name,
			genres: miscUtils.extractFilterAndSortFieldValues(source.results.genres, 'name'),
			description: source.results.deck,
			releaseDate: getReleaseDate(source.results),
			imageUrl: this.getImageUrl(source.results.image),
			developers: miscUtils.extractFilterAndSortFieldValues(source.results.developers, 'name'),
			publishers: miscUtils.extractFilterAndSortFieldValues(source.results.publishers, 'name'),
			platforms: miscUtils.extractFilterAndSortFieldValues(source.results.platforms, 'name')
		};
	}

	/**
	 * Helper to get the image URL
	 * @param result the source data
	 * @returns the possibly undefined extracted image URL
	 */
	private getImageUrl(result: GiantBombImage | undefined): string | undefined {
		
		if(result) {

			if(result.screen_url) {

				return result.screen_url;
			}
			else if(result.medium_url) {

				return result.medium_url;
			}
		}

		return undefined;
	}
}

/**
 * Singleton instance of videogame search external service mapper
 */
export const videogameExternalSearchServiceMapper = new VideogameExternalSearchServiceMapper();

/**
 * Singleton instance of videogame details external service mapper
 */
export const videogameExternalDetailsServiceMapper = new VideogameExternalDetailsServiceMapper();

