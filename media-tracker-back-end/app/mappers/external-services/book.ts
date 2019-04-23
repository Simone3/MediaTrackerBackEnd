import { GoogleBooksSearchResult, GoogleBooksDetailsResponse, GoogleBooksVolumeLight} from "../../models/external-services/media-items/book";
import { SearchBookCatalogResultInternal, CatalogBookInternal } from "../../models/internal/media-items/book";
import { ModelMapper } from "../common";
import { stringUtils } from "../../controllers/utilities/misc-utils";

/**
 * Mapper for the books search external service
 */
class BookExternalSearchServiceMapper extends ModelMapper<SearchBookCatalogResultInternal, GoogleBooksSearchResult, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): GoogleBooksSearchResult {

		throw "convertToExternal unimplemented"
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: GoogleBooksSearchResult): SearchBookCatalogResultInternal {
		
		return {
			catalogId: source.id,
			title: source.volumeInfo.title,
			releaseDate: source.volumeInfo.publishedDate
		};
	}
}

/**
 * Mapper for the books details external service
 */
class BookExternalDetailsServiceMapper extends ModelMapper<CatalogBookInternal, GoogleBooksDetailsResponse, never> {
	
	/**
	 * @override
	 */
	protected convertToExternal(): GoogleBooksDetailsResponse {

		throw "convertToExternal unimplemented"
	}
	
	/**
	 * @override
	 */
	protected convertToInternal(source: GoogleBooksDetailsResponse): CatalogBookInternal {
		
		return {
			name: source.volumeInfo.title,
			author: this.getAuthor(source.volumeInfo)
		};
	}

	/**
	 * Helper to get the author(s) name
	 */
	private getAuthor(volume: GoogleBooksVolumeLight): string | undefined {

		return stringUtils.join(volume.authors, ', ', undefined);
	}
}

/**
 * Singleton instance of book search external service mapper
 */
export const bookExternalSearchServiceMapper = new BookExternalSearchServiceMapper();

/**
 * Singleton instance of book details external service mapper
 */
export const bookExternalDetailsServiceMapper = new BookExternalDetailsServiceMapper();


