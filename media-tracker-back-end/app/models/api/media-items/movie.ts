import { AddMediaItemRequest, CatalogMediaItem, FilterMediaItemsRequest, FilterMediaItemsResponse, GetAllMediaItemsResponse, GetMediaItemFromCatalogResponse, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest } from 'app/models/api/media-items/media-item';
import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Model for a movie, publicly exposed via API
 */
export class Movie extends MediaItem {

	/**
	 * The movie director
	 */
	@IsOptional()
	@IsString()
	public director?: string;

	/**
	 * The movie duration in minutes
	 */
	@IsOptional()
	@IsInt()
	public durationMinutes?: number;
}

/**
 * Model for a movie with an ID property, publicly exposed via API
 */
export class IdentifiedMovie extends Movie {

	/**
	 * The movie unique ID
	 */
	@IsNotEmpty()
	@IsString()
	public uid!: string;
}

/**
 * Movie filtering options, publicly exposed via API
 */
export class MovieFilter extends MediaItemFilter {

}

/**
 * Values for movie ordering options, publicly exposed via API
 */
export class MovieSortField extends MediaItemSortField {

	public static readonly DIRECTOR: string = 'DIRECTOR';
	
	public static values(): string[] {

		return [ ...MediaItemSortField.commonValues(), this.DIRECTOR ];
	}
}

/**
 * Movies sort by options, publicly exposed via API
 */
export class MovieSortBy extends MediaItemSortBy {

	/**
	 * The sort by field
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(MovieSortField.values())
	public field!: string;
}

/**
 * Request for the 'add movie' API
 */
export class AddMovieRequest extends AddMediaItemRequest {

	/**
	 * The movie to add
	 */
	@IsDefined()
	@Type(() => {
		return Movie;
	})
	@ValidateNested()
	public newMovie!: Movie;
}

/**
 * Response for the 'get all movies' API
 */
export class GetAllMoviesResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved movies
	 */
	public movies: IdentifiedMovie[] = [];
}

/**
 * Request for the 'update movie' API
 */
export class UpdateMovieRequest extends UpdateMediaItemRequest {

	/**
	 * The new movie data to save
	 */
	@IsDefined()
	@Type(() => {
		return Movie;
	})
	@ValidateNested()
	public movie!: Movie;
}

/**
 * Request for the 'filter movies' API
 */
export class FilterMoviesRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => {
		return MovieFilter;
	})
	@ValidateNested()
	public filter?: MovieFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return MovieSortBy;
	})
	@ValidateNested()
	public sortBy?: MovieSortBy[];
}

/**
 * Response for the 'filter movies' API
 */
export class FilterMoviesResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved movies
	 */
	public movies: IdentifiedMovie[] = [];
}

/**
 * Request for the 'search movies' API
 */
export class SearchMoviesRequest extends SearchMediaItemsRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => {
		return MovieFilter;
	})
	@ValidateNested()
	public filter?: MovieFilter;
}

/**
 * Response for the 'search movies' API
 */
export class SearchMoviesResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved movies
	 */
	public movies: IdentifiedMovie[] = [];
}

/**
 * Model for a movie from the catalog, publicly exposed via API
 */
export class CatalogMovie extends CatalogMediaItem {

	/**
	 * The movie director
	 */
	@IsOptional()
	@IsString()
	public director?: string;
}

/**
 * Movie catalog search result, publicly exposed via API
 */
export class SearchMovieCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Response for the 'search catalog' API
 */
export class SearchMovieCatalogResponse extends SearchMediaItemCatalogResponse {

}

/**
 * Response for the 'get from catalog' API
 */
export class GetMovieFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The movie details
	 */
	public catalogMovie: CatalogMovie = new CatalogMovie();
}
