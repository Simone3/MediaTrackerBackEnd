import { AddMediaItemRequest, CatalogMediaItem, FilterMediaItemsRequest, FilterMediaItemsResponse, GetAllMediaItemsResponse, GetMediaItemFromCatalogResponse, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest } from 'app/models/api/media-items/media-item';
import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Model for a TV show from the catalog, publicly exposed via API
 */
export class CatalogTvShow extends CatalogMediaItem {

	/**
	 * The TV show creator
	 */
	@IsOptional()
	@IsString()
	public creator?: string;

	/**
	 * The TV next episode air date
	 */
	@IsOptional()
	@IsString()
	public nextEpisodeAirDate?: string;
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
	public creator?: string;
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
	public uid!: string;
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

	public static readonly CREATOR: string = 'CREATOR';
	
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
	public field!: string;
}

/**
 * TvShow catalog search result, publicly exposed via API
 */
export class SearchTvShowCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Request for the 'add TV show' API
 */
export class AddTvShowRequest extends AddMediaItemRequest {

	/**
	 * The TV show to add
	 */
	@IsDefined()
	@Type(() => TvShow)
	@ValidateNested()
	public newTvShow!: TvShow;
};

/**
 * Response for the 'get all TV shows' API
 */
export class GetAllTvShowsResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	public tvShows: IdentifiedTvShow[] = [];
};

/**
 * Request for the 'update TV show' API
 */
export class UpdateTvShowRequest extends UpdateMediaItemRequest {

	/**
	 * The new TV show data to save
	 */
	@IsDefined()
	@Type(() => TvShow)
	@ValidateNested()
	public tvShow!: TvShow;
};

/**
 * Request for the 'filter TV shows' API
 */
export class FilterTvShowsRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => TvShowFilter)
	@ValidateNested()
	public filter?: TvShowFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TvShowSortBy)
	@ValidateNested()
	public sortBy?: TvShowSortBy[];
};

/**
 * Response for the 'filter TV shows' API
 */
export class FilterTvShowsResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	public tvShows: IdentifiedTvShow[] = [];
}

/**
 * Request for the 'search TV shows' API
 */
export class SearchTvShowsRequest extends SearchMediaItemsRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => TvShowFilter)
	@ValidateNested()
	public filter?: TvShowFilter;
};

/**
 * Response for the 'search TV shows' API
 */
export class SearchTvShowsResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	public tvShows: IdentifiedTvShow[] = [];
};

/**
 * Response for the 'search catalog' API
 */
export class SearchTvShowCatalogResponse extends SearchMediaItemCatalogResponse {

};

/**
 * Response for the 'get from catalog' API
 */
export class GetTvShowFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The TV show details
	 */
	public catalogTvShow: CatalogTvShow = new CatalogTvShow();
};