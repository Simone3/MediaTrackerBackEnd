import { CatalogMediaItem, MediaItem, MediaItemSortField, MediaItemSortBy, AddMediaItemRequest, GetAllMediaItemsResponse, UpdateMediaItemRequest, FilterMediaItemsRequest, MediaItemFilter, FilterMediaItemsResponse, SearchMediaItemsRequest, SearchMediaItemsResponse, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, GetMediaItemFromCatalogResponse } from "./media-item";
import { IsString, IsOptional, IsNotEmpty, IsIn, IsDefined, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

/**
 * Model for a TV show from the catalog, publicly exposed via API
 */
export class CatalogTvShow extends CatalogMediaItem {

	/**
	 * The TV show creator
	 */
	@IsOptional()
	@IsString()
	creator?: string;

	/**
	 * The TV next episode air date
	 */
	@IsOptional()
	@IsString()
	nextEpisodeAirDate?: string;
}

/**
 * Model for a TV show, publicly exposed via API
 */
export class TvShow extends MediaItem {

	/**
	 * The TV show creator
	 */
	@IsOptional()
	@IsString()
	creator?: string;
};

/**
 * Model for a TV show with an ID property, publicly exposed via API
 */
export class IdentifiedTvShow extends TvShow {

	/**
	 * The TV show unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};

/**
 * TvShow filtering options, publicly exposed via API
 */
export class TvShowFilter extends MediaItemFilter{

}

/**
 * Values for TV show ordering options, publicly exposed via API
 */
export class TvShowSortField extends MediaItemSortField {

	static readonly CREATOR: string = 'CREATOR';
	
	public static values(): string[] {

		return [...MediaItemSortField.commonValues(), this.CREATOR];
	}
}

/**
 * TvShows sort by options, publicly exposed via API
 */
export class TvShowSortBy extends MediaItemSortBy {

	/**
	 * The sort by field
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(TvShowSortField.values())
	field!: string;
}

/**
 * TvShow catalog search result, publicly exposed via API
 */
export class SearchTvShowCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Request for the "add TV show" API
 */
export class AddTvShowRequest extends AddMediaItemRequest {

	/**
	 * The TV show to add
	 */
	@IsDefined()
	@Type(() => TvShow)
	@ValidateNested()
	newTvShow!: TvShow;
};

/**
 * Response for the "get all TV shows" API
 */
export class GetAllTvShowsResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	tvShows: IdentifiedTvShow[] = [];
};

/**
 * Request for the "update TV show" API
 */
export class UpdateTvShowRequest extends UpdateMediaItemRequest {

	/**
	 * The new TV show data to save
	 */
	@IsDefined()
	@Type(() => TvShow)
	@ValidateNested()
	tvShow!: TvShow;
};

/**
 * Request for the "filter TV shows" API
 */
export class FilterTvShowsRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => TvShowFilter)
	@ValidateNested()
	filter?: TvShowFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TvShowSortBy)
	@ValidateNested()
	sortBy?: TvShowSortBy[];
};

/**
 * Response for the "filter TV shows" API
 */
export class FilterTvShowsResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	tvShows: IdentifiedTvShow[] = [];
}

/**
 * Request for the "search TV shows" API
 */
export class SearchTvShowsRequest extends SearchMediaItemsRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => TvShowFilter)
	@ValidateNested()
	filter?: TvShowFilter;
};

/**
 * Response for the "search TV shows" API
 */
export class SearchTvShowsResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	tvShows: IdentifiedTvShow[] = [];
};

/**
 * Response for the "search catalog" API
 */
export class SearchTvShowCatalogResponse extends SearchMediaItemCatalogResponse {

};

/**
 * Response for the "get from catalog" API
 */
export class GetTvShowFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The TV show details
	 */
	catalogTvShow: CatalogTvShow = new CatalogTvShow();
};