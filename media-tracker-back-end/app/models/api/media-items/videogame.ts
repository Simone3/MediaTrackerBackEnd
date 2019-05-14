import { AddMediaItemRequest, CatalogMediaItem, FilterMediaItemsRequest, FilterMediaItemsResponse, GetAllMediaItemsResponse, GetMediaItemFromCatalogResponse, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest } from 'app/models/api/media-items/media-item';
import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Model for a videogame, publicly exposed via API
 */
export class Videogame extends MediaItem {

	/**
	 * The videogame developer(s)
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public developers?: string[];

	/**
	 * The videogame publisher(s)
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public publishers?: string[];
	
	/**
	 * The list of platforms on which the game runs
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public platforms?: string[];
	
	/**
	 * The average game length in hours
	 */
	@IsOptional()
	@IsInt()
	public averageLengthHours?: number;
}

/**
 * Model for a videogame with an ID property, publicly exposed via API
 */
export class IdentifiedVideogame extends Videogame {

	/**
	 * The videogame unique ID
	 */
	@IsNotEmpty()
	@IsString()
	public uid!: string;
}

/**
 * Videogame filtering options, publicly exposed via API
 */
export class VideogameFilter extends MediaItemFilter {

}

/**
 * Values for videogame ordering options, publicly exposed via API
 */
export class VideogameSortField extends MediaItemSortField {

	public static readonly DEVELOPER: string = 'DEVELOPER';
	
	public static values(): string[] {

		return [ ...MediaItemSortField.commonValues(), this.DEVELOPER ];
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
	public field!: string;
}

/**
 * Request for the 'add videogame' API
 */
export class AddVideogameRequest extends AddMediaItemRequest {

	/**
	 * The videogame to add
	 */
	@IsDefined()
	@Type(() => {
		return Videogame;
	})
	@ValidateNested()
	public newVideogame!: Videogame;
}

/**
 * Response for the 'get all videogames' API
 */
export class GetAllVideogamesResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved videogames
	 */
	public videogames: IdentifiedVideogame[] = [];
}

/**
 * Request for the 'update videogame' API
 */
export class UpdateVideogameRequest extends UpdateMediaItemRequest {

	/**
	 * The new videogame data to save
	 */
	@IsDefined()
	@Type(() => {
		return Videogame;
	})
	@ValidateNested()
	public videogame!: Videogame;
}

/**
 * Request for the 'filter videogames' API
 */
export class FilterVideogamesRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => {
		return VideogameFilter;
	})
	@ValidateNested()
	public filter?: VideogameFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return VideogameSortBy;
	})
	@ValidateNested()
	public sortBy?: VideogameSortBy[];
}

/**
 * Response for the 'filter videogames' API
 */
export class FilterVideogamesResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved videogames
	 */
	public videogames: IdentifiedVideogame[] = [];
}

/**
 * Request for the 'search videogames' API
 */
export class SearchVideogamesRequest extends SearchMediaItemsRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => {
		return VideogameFilter;
	})
	@ValidateNested()
	public filter?: VideogameFilter;
}

/**
 * Response for the 'search videogames' API
 */
export class SearchVideogamesResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved videogames
	 */
	public videogames: IdentifiedVideogame[] = [];
}

/**
 * Model for a videogame from the catalog, publicly exposed via API
 */
export class CatalogVideogame extends CatalogMediaItem {

	/**
	 * The videogame developer(s)
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public developers?: string[];

	/**
	 * The videogame publisher(s)
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public publishers?: string[];
	
	/**
	 * The list of platforms on which the game runs
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public platforms?: string[];
}

/**
 * Videogame catalog search result, publicly exposed via API
 */
export class SearchVideogameCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Response for the 'search catalog' API
 */
export class SearchVideogameCatalogResponse extends SearchMediaItemCatalogResponse {

}

/**
 * Response for the 'get from catalog' API
 */
export class GetVideogameFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The videogame details
	 */
	public catalogVideogame: CatalogVideogame = new CatalogVideogame();
}
