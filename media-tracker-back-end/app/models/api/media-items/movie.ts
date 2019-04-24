import { AddMediaItemRequest, CatalogMediaItem, FilterMediaItemsRequest, FilterMediaItemsResponse, GetAllMediaItemsResponse, GetMediaItemFromCatalogResponse, MediaItem, MediaItemFilter, MediaItemSortBy, MediaItemSortField, SearchMediaItemCatalogResponse, SearchMediaItemCatalogResult, SearchMediaItemsRequest, SearchMediaItemsResponse, UpdateMediaItemRequest } from "app/models/api/media-items/media-item";
import { Type } from "class-transformer";
import { IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

/**
 * Model for a movie from the catalog, publicly exposed via API
 */
export class CatalogMovie extends CatalogMediaItem {

	/**
	 * The movie director
	 */
	@IsOptional()
	@IsString()
	director?: string;
}

/**
 * Model for a movie, publicly exposed via API
 */
export class Movie extends MediaItem {

	/**
	 * The movie director
	 */
	@IsOptional()
	@IsString()
	director?: string;
};

/**
 * Model for a movie with an ID property, publicly exposed via API
 */
export class IdentifiedMovie extends Movie {

	/**
	 * The movie unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};

/**
 * Movie filtering options, publicly exposed via API
 */
export class MovieFilter extends MediaItemFilter{

}

/**
 * Values for movie ordering options, publicly exposed via API
 */
export class MovieSortField extends MediaItemSortField {

	static readonly DIRECTOR: string = 'DIRECTOR';
	
	public static values(): string[] {

		return [...MediaItemSortField.commonValues(), this.DIRECTOR];
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
	field!: string;
}

/**
 * Movie catalog search result, publicly exposed via API
 */
export class SearchMovieCatalogResult extends SearchMediaItemCatalogResult {

}

/**
 * Request for the "add movie" API
 */
export class AddMovieRequest extends AddMediaItemRequest {

	/**
	 * The movie to add
	 */
	@IsDefined()
	@Type(() => Movie)
	@ValidateNested()
	newMovie!: Movie;
};

/**
 * Response for the "get all movies" API
 */
export class GetAllMoviesResponse extends GetAllMediaItemsResponse {

	/**
	 * The retrieved movies
	 */
	movies: IdentifiedMovie[] = [];
};

/**
 * Request for the "update movie" API
 */
export class UpdateMovieRequest extends UpdateMediaItemRequest {

	/**
	 * The new movie data to save
	 */
	@IsDefined()
	@Type(() => Movie)
	@ValidateNested()
	movie!: Movie;
};

/**
 * Request for the "filter movies" API
 */
export class FilterMoviesRequest extends FilterMediaItemsRequest {

	/**
	 * Filtering options
	 */
	@IsOptional()
	@Type(() => MovieFilter)
	@ValidateNested()
	filter?: MovieFilter;

	/**
	 * Ordering options
	 */
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => MovieSortBy)
	@ValidateNested()
	sortBy?: MovieSortBy[];
};

/**
 * Response for the "filter movies" API
 */
export class FilterMoviesResponse extends FilterMediaItemsResponse {

	/**
	 * The retrieved movies
	 */
	movies: IdentifiedMovie[] = [];
}

/**
 * Request for the "search movies" API
 */
export class SearchMoviesRequest extends SearchMediaItemsRequest {

	/**
	 * Currently active filtering options
	 */
	@IsOptional()
	@Type(() => MovieFilter)
	@ValidateNested()
	filter?: MovieFilter;
};

/**
 * Response for the "search movies" API
 */
export class SearchMoviesResponse extends SearchMediaItemsResponse {

	/**
	 * The retrieved movies
	 */
	movies: IdentifiedMovie[] = [];
};

/**
 * Response for the "search catalog" API
 */
export class SearchMovieCatalogResponse extends SearchMediaItemCatalogResponse {

};

/**
 * Response for the "get from catalog" API
 */
export class GetMovieFromCatalogResponse extends GetMediaItemFromCatalogResponse {

	/**
	 * The movie details
	 */
	catalogMovie: CatalogMovie = new CatalogMovie();
};