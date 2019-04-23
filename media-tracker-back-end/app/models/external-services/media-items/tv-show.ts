import { IsOptional, IsDefined, ValidateNested, IsNotEmpty, IsString, IsInt, IsBoolean } from "class-validator";
import { Type } from "class-transformer";

/**
 * Response of the external TV show search service
 */
export class TmdbTvShowSearchResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbTvShowSearchResult)
	@ValidateNested()
	results?: TmdbTvShowSearchResult[];
}

/**
 * Result of the external TV show search service
 */
export class TmdbTvShowSearchResult {

	@IsNotEmpty()
	@IsInt()
	id!: number;

	@IsNotEmpty()
	@IsString()
	name!: string;

	@IsOptional()
	@IsString()
	first_air_date?: string;
}

/**
 * Query params of the external TV show search service
 */
export type TmdbTvShowSearchQueryParams = {

	query: string,
	api_key: string,
};

/**
 * Response of the external TV show details service
 */
export class TmdbTvShowDetailsResponse {
	
	@IsNotEmpty()
	@IsInt()
    id!: number;

	@IsOptional()
	@IsString()
    first_air_date?: string;

	@IsOptional()
	@IsBoolean()
    in_production?: boolean;

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbTvShowGenre)
	@ValidateNested()
    genres?: TmdbTvShowGenre[];

	@IsNotEmpty()
	@IsString()
    name!: string;

	@IsOptional()
	@IsString()
    overview?: string;

	@IsOptional()
	@IsInt({each: true})
    episode_run_time?: number[];

	@IsOptional()
	@IsInt()
    number_of_episodes?: number;

	@IsOptional()
	@IsInt()
    number_of_seasons?: number;

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbTvShowCreator)
	@ValidateNested()
    created_by?: TmdbTvShowCreator[];
 
	@IsOptional()
	@IsString()
    backdrop_path?: string;
}

/**
 * Creator model for the external TV show details service
 */
export class TmdbTvShowCreator {

	@IsNotEmpty()
	@IsString()
	name!: string;
}

/**
 * Genre model for the external TV show details service
 */
export class TmdbTvShowGenre {

	@IsNotEmpty()
	@IsString()
	name!: string;
}

/**
 * Query params of the external TV show details service
 */
export type TmdbTvShowDetailsQueryParams = {

	api_key: string
};

/**
 * Response of the external TV show season data service
 */
export class TmdbTvShowSeasonDataResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbTvShowEpisode)
	@ValidateNested()
    episodes?: TmdbTvShowEpisode[];
}

/**
 * Episode model for the external TV show season data service
 */
export class TmdbTvShowEpisode {

	@IsOptional()
	@IsString()
    air_date?: string;
}

/**
 * Query params of the external TV show details service
 */
export type TmdbTvShowSeasonDataQueryParams = {

	api_key: string
};