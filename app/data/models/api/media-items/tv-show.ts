import { AddMediaItemRequest, CatalogMediaItem, FilterMediaItemsRequest, FilterMediaItemsResponse, GetAllMediaItemsResponse, GetMediaItemFromCatalogResponse, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest } from 'app/data/models/api/media-items/media-item';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Model for a TV show season, publicly exposed via API
 */
export class TvShowSeason {

	/**
	 * The season number
	 */
	@IsDefined()
	@IsInt()
	public number!: number;

	/**
	 * The number of total episodes
	 */
	@IsOptional()
	@IsInt()
	public episodesNumber?: number;

	/**
	 * The number of episodes watched by the user
	 */
	@IsOptional()
	@IsInt()
	public watchedEpisodesNumber?: number;
}

/**
 * Model for a TV show, publicly exposed via API
 */
export class TvShow extends MediaItem {

	/**
	 * The TV show creator(s)
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public creators?: string[];

	/**
	 * The average episode runtime in minutes
	 */
	@IsOptional()
	@IsInt()
	public averageEpisodeRuntimeMinutes?: number;
	
	/**
	 * The list of seasons
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return TvShowSeason;
	})
	@ValidateNested()
	public seasons?: TvShowSeason[];
	
	/**
	 * If the show is in production or if it is concluded
	 */
	@IsOptional()
	@IsBoolean()
	public inProduction?: boolean;
	
	/**
	 * The air date of the next episode, meaningful only if inProduction = true
	 */
	@IsOptional()
	@IsDateString()
	public nextEpisodeAirDate?: string;
}

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
}

/**
 * TvShow filtering options, publicly exposed via API
 */
export class TvShowFilter extends MediaItemFilter {

}

/**
 * Values for TV show ordering options, publicly exposed via API
 */
export class TvShowSortField extends MediaItemSortField {

	public static readonly CREATOR: string = 'CREATOR';
	
	public static values(): string[] {

		return [ ...MediaItemSortField.commonValues(), this.CREATOR ];
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
 * Request for the 'add TV show' API
 */
export class AddTvShowRequest extends AddMediaItemRequest {

	/**
	 * The TV show to add
	 */
	@IsDefined()
	@Type(() => {
		return TvShow;
	})
	@ValidateNested()
	public newTvShow!: TvShow;
}

/**
 * Response for the 'get all TV shows' API
 */
export class GetAllTvShowsResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return IdentifiedTvShow;
	})
	@ValidateNested()
	public tvShows: IdentifiedTvShow[] = [];
}

/**
 * Request for the 'update TV show' API
 */
export class UpdateTvShowRequest extends UpdateMediaItemRequest {

	/**
	 * The new TV show data to save
	 */
	@IsDefined()
	@Type(() => {
		return TvShow;
	})
	@ValidateNested()
	public tvShow!: TvShow;
}

/**
 * Request for the 'filter TV shows' API
 */
export class FilterTvShowsRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => {
		return TvShowFilter;
	})
	@ValidateNested()
	public filter?: TvShowFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return TvShowSortBy;
	})
	@ValidateNested()
	public sortBy?: TvShowSortBy[];
}

/**
 * Response for the 'filter TV shows' API
 */
export class FilterTvShowsResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return IdentifiedTvShow;
	})
	@ValidateNested()
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
	@Type(() => {
		return TvShowFilter;
	})
	@ValidateNested()
	public filter?: TvShowFilter;
}

/**
 * Response for the 'search TV shows' API
 */
export class SearchTvShowsResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved TV shows
	 */
	@IsDefined()
	@IsDefined({ each: true })
	@Type(() => {
		return IdentifiedTvShow;
	})
	@ValidateNested()
	public tvShows: IdentifiedTvShow[] = [];
}

/**
 * Model for a TV show season from the catalog, publicly exposed via API
 */
export class CatalogTvShowSeason {

	/**
	 * The season number
	 */
	@IsDefined()
	@IsInt()
	public number!: number;

	/**
	 * The number of total episodes
	 */
	@IsOptional()
	@IsInt()
	public episodesNumber?: number;
}

/**
 * Model for a TV show from the catalog, publicly exposed via API
 */
export class CatalogTvShow extends CatalogMediaItem {

	/**
	 * The TV show creator(s)
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@IsString({ each: true })
	public creators?: string[];

	/**
	 * The average episode runtime in minutes
	 */
	@IsOptional()
	@IsInt()
	public averageEpisodeRuntimeMinutes?: number;
	
	/**
	 * The list of seasons
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return CatalogTvShowSeason;
	})
	@ValidateNested()
	public seasons?: CatalogTvShowSeason[];
	
	/**
	 * If the show is in production or if it is concluded
	 */
	@IsOptional()
	@IsBoolean()
	public inProduction?: boolean;
	
	/**
	 * The air date of the next episode, meaningful only if inProduction = true
	 */
	@IsOptional()
	@IsDateString()
	public nextEpisodeAirDate?: string;
}

/**
 * TvShow catalog search result, publicly exposed via API
 */
export class SearchTvShowCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Response for the 'search catalog' API
 */
export class SearchTvShowCatalogResponse extends SearchMediaItemCatalogResponse {

}

/**
 * Response for the 'get from catalog' API
 */
export class GetTvShowFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The TV show details
	 */
	@IsDefined()
	@Type(() => {
		return CatalogTvShow;
	})
	@ValidateNested()
	public catalogTvShow: CatalogTvShow = new CatalogTvShow();
}
