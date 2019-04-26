import { ModelMapper } from 'app/mappers/common';
import { AppError } from 'app/models/error/error';
import { GiantBombDetailsResponse, GiantBombSearchResult } from 'app/models/external-services/media-items/videogame';
import { CatalogVideogameInternal, SearchVideogameCatalogResultInternal } from 'app/models/internal/media-items/videogame';
import { dateUtils } from 'app/utilities/date-utils';
import { stringUtils } from 'app/utilities/string-utils';

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
			title: source.name,
			releaseDate: this.getReleaseDate(source)
		};
	}

	/**
	 * Helper to get the release date from the videogame data
	 * @param gameData the game data
	 * @returns the release date as a string or undefined
	 */
	private getReleaseDate(gameData: GiantBombSearchResult): string | undefined {

		if(gameData.expected_release_year) {

			return dateUtils.dateStringFromYearMonthDay(gameData.expected_release_year, gameData.expected_release_month, gameData.expected_release_day);
		}
		else if(gameData.original_release_date) {

			return gameData.original_release_date;
		}
		else {

			return undefined;
		}
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
			developer: stringUtils.join(source.results.developers, ', ', undefined, [ 'name' ]),
			name: source.results.name
		};
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

