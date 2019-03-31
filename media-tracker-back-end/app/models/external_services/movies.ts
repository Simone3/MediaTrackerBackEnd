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