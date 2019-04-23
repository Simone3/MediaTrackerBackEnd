import { GoogleBooksSearchResult, GoogleBooksDetailsResponse, GoogleBooksVolumeLight} from "../../models/external-services/media-items/book";
import { SearchBookCatalogResultInternal, CatalogBookInternal } from "../../models/internal/media-items/book";
import { ModelMapper } from "../common";

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

		const SEP = ', ';

		if(volume.authors) {

			let result = '';
			for(let author of volume.authors) {

				if(author) {

					result += author + SEP;
				}
			}
			return result.length > 0 ? result.slice(0, -SEP.length) : undefined;
		}
		else {

			return undefined;
		}
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


