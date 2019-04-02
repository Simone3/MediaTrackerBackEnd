import { IsOptional, IsDefined, ValidateNested, IsNotEmpty, IsString, IsInt } from "class-validator";
import { Type } from "class-transformer";

/**
 * Response of the external movie search service
 */
export class TheMovieDbSearchResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TheMovieDbSearchResult)
	@ValidateNested()
	results?: TheMovieDbSearchResult[];
}

/**
 * Result of the external movie search service
 */
export class TheMovieDbSearchResult {

	@IsNotEmpty()
	@IsInt()
	id!: number;

	@IsNotEmpty()
	@IsString()
	title!: string;

	@IsOptional()
	@IsString()
	release_date?: string;
}

/**
 * Query params of the external movie search service
 */
export type TheMovieDbSearchQueryParams = {

	query: string,
	api_key: string,
};

/**
 * Response of the external movie details service
 */
export class TheMovieDbDetailsResponse {

	@IsNotEmpty()
	@IsInt()
	id!: number;
	
	@IsOptional()
	@IsString()
	release_date?: string;
	
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TheMovieDbGenre)
	@ValidateNested()
	genres?: TheMovieDbGenre[];
	
	@IsNotEmpty()
	@IsString()
	title!: string;
	
	@IsOptional()
	@IsString()
	overview?: string;
	
	@IsOptional()
	@IsInt()
	runtime?: number;
	
	@IsOptional()
	@Type(() => TheMovieDbCredits)
	@ValidateNested()
	credits?: TheMovieDbCredits;
	
	@IsOptional()
	@IsString()
	backdropPath?: string;
}

/**
 * Credits model for the external movie details service
 */
export class TheMovieDbCredits {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TheMovieDbCrewPerson)
	@ValidateNested()
	crew?: TheMovieDbCrewPerson[];
}

/**
 * Crew model for the external movie details service
 */
export class TheMovieDbCrewPerson {

	@IsNotEmpty()
	@IsString()
	name!: string;

	@IsOptional()
	@IsString()
	job?: string;
}

/**
 * Genre model for the external movie details service
 */
export class TheMovieDbGenre {

	@IsNotEmpty()
	@IsString()
	name!: string;
}

/**
 * Query params of the external movie details service
 */
export type TheMovieDbDetailsQueryParams = {

	append_to_response: string,
	api_key: string,
};