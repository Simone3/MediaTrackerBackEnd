import { IsOptional, IsDefined, ValidateNested, IsNotEmpty, IsString, IsInt } from "class-validator";
import { Type } from "class-transformer";

/**
 * Response of the external movie search service
 */
export class TmdbMovieSearchResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbMovieSearchResult)
	@ValidateNested()
	results?: TmdbMovieSearchResult[];
}

/**
 * Result of the external movie search service
 */
export class TmdbMovieSearchResult {

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
export type TmdbMovieSearchQueryParams = {

	query: string,
	api_key: string,
};

/**
 * Response of the external movie details service
 */
export class TmdbMovieDetailsResponse {

	@IsNotEmpty()
	@IsInt()
	id!: number;
	
	@IsOptional()
	@IsString()
	release_date?: string;
	
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbMovieGenre)
	@ValidateNested()
	genres?: TmdbMovieGenre[];
	
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
	@Type(() => TmdbMovieCredits)
	@ValidateNested()
	credits?: TmdbMovieCredits;
	
	@IsOptional()
	@IsString()
	backdropPath?: string;
}

/**
 * Credits model for the external movie details service
 */
export class TmdbMovieCredits {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbMovieCrewPerson)
	@ValidateNested()
	crew?: TmdbMovieCrewPerson[];
}

/**
 * Crew model for the external movie details service
 */
export class TmdbMovieCrewPerson {

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
export class TmdbMovieGenre {

	@IsNotEmpty()
	@IsString()
	name!: string;
}

/**
 * Query params of the external movie details service
 */
export type TmdbMovieDetailsQueryParams = {

	append_to_response: string,
	api_key: string,
};