import { AddMediaItemRequest, CatalogMediaItem, FilterMediaItemsRequest, FilterMediaItemsResponse, GetAllMediaItemsResponse, GetMediaItemFromCatalogResponse, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest } from "app/models/api/media-items/media-item";
import { Type } from "class-transformer";
import { IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

/**
 * Model for a videogame from the catalog, publicly exposed via API
 */
export class CatalogVideogame extends CatalogMediaItem {

	/**
	 * The videogame developer
	 */
	@IsOptional()
	@IsString()
	developer?: string;
}

/**
 * Model for a videogame, publicly exposed via API
 */
export class Videogame extends MediaItem {

	/**
	 * The videogame developer
	 */
	@IsOptional()
	@IsString()
	developer?: string;
};

/**
 * Model for a videogame with an ID property, publicly exposed via API
 */
export class IdentifiedVideogame extends Videogame {

	/**
	 * The videogame unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};

/**
 * Videogame filtering options, publicly exposed via API
 */
export class VideogameFilter extends MediaItemFilter{

}

/**
 * Values for videogame ordering options, publicly exposed via API
 */
export class VideogameSortField extends MediaItemSortField {

	static readonly DEVELOPER: string = 'DEVELOPER';
	
	public static values(): string[] {

		return [...MediaItemSortField.commonValues(), this.DEVELOPER];
	}
}

/**
 * Videogames sort by options, publicly exposed via API
 */
export class VideogameSortBy extends MediaItemSortBy {

	/**
	 * The sort by field
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(VideogameSortField.values())
	field!: string;
}

/**
 * Videogame catalog search result, publicly exposed via API
 */
export class SearchVideogameCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Request for the "add videogame" API
 */
export class AddVideogameRequest extends AddMediaItemRequest {

	/**
	 * The videogame to add
	 */
	@IsDefined()
	@Type(() => Videogame)
	@ValidateNested()
	newVideogame!: Videogame;
};

/**
 * Response for the "get all videogames" API
 */
export class GetAllVideogamesResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved videogames
	 */
	videogames: IdentifiedVideogame[] = [];
};

/**
 * Request for the "update videogame" API
 */
export class UpdateVideogameRequest extends UpdateMediaItemRequest {

	/**
	 * The new videogame data to save
	 */
	@IsDefined()
	@Type(() => Videogame)
	@ValidateNested()
	videogame!: Videogame;
};

/**
 * Request for the "filter videogames" API
 */
export class FilterVideogamesRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => VideogameFilter)
	@ValidateNested()
	filter?: VideogameFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => VideogameSortBy)
	@ValidateNested()
	sortBy?: VideogameSortBy[];
};

/**
 * Response for the "filter videogames" API
 */
export class FilterVideogamesResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved videogames
	 */
	videogames: IdentifiedVideogame[] = [];
}

/**
 * Request for the "search videogames" API
 */
export class SearchVideogamesRequest extends SearchMediaItemsRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => VideogameFilter)
	@ValidateNested()
	filter?: VideogameFilter;
};

/**
 * Response for the "search videogames" API
 */
export class SearchVideogamesResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved videogames
	 */
	videogames: IdentifiedVideogame[] = [];
};

/**
 * Response for the "search catalog" API
 */
export class SearchVideogameCatalogResponse extends SearchMediaItemCatalogResponse {

};

/**
 * Response for the "get from catalog" API
 */
export class GetVideogameFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The videogame details
	 */
	catalogVideogame: CatalogVideogame = new CatalogVideogame();
};