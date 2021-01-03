import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Result of the external TV show search service
 */
export class TmdbTvShowSearchResult {

	@IsNotEmpty()
	@IsInt()
	public id!: number;

	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsOptional()
	@IsString()
	public first_air_date?: string;
}

/**
 * Response of the external TV show search service
 */
export class TmdbTvShowSearchResponse {

	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return TmdbTvShowSearchResult;
	})
	@ValidateNested()
	public results?: TmdbTvShowSearchResult[];
}

/**
 * Creator model for the external TV show details service
 */
export class TmdbTvShowCreator {

	@IsNotEmpty()
	@IsString()
	public name!: string;
}

/**
 * Genre model for the external TV show details service
 */
export class TmdbTvShowGenre {

	@IsNotEmpty()
	@IsString()
	public name!: string;
}

/**
 * Season model for the external TV show details service
 */
export class TmdbTvShowSeason {

	@IsOptional()
	@IsInt()
	public episode_count?: number;

	@IsNotEmpty()
	@IsInt()
	public season_number!: number;
}

/**
 * Response of the external TV show details service
 */
export class TmdbTvShowDetailsResponse {
	
	@IsNotEmpty()
	@IsInt()
	public id!: number;

	@IsOptional()
	@IsString()
	public first_air_date?: string;

	@IsOptional()
	@IsBoolean()
	public in_production?: boolean;

	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return TmdbTvShowGenre;
	})
	@ValidateNested()
	public genres?: TmdbTvShowGenre[];

	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsOptional()
	@IsString()
	public overview?: string;

	@IsOptional()
	@IsInt({ each: true })
	public episode_run_time?: number[];

	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return TmdbTvShowSeason;
	})
	@ValidateNested()
	public seasons?: TmdbTvShowSeason[];

	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return TmdbTvShowCreator;
	})
	@ValidateNested()
	public created_by?: TmdbTvShowCreator[];
 
	@IsOptional()
	@IsString()
	public backdrop_path?: string;
}

/**
 * Episode model for the external TV show season data service
 */
export class TmdbTvShowEpisode {

	@IsOptional()
	@IsString()
	public air_date?: string;
}

/**
 * Response of the external TV show season data service
 */
export class TmdbTvShowSeasonDataResponse {

	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return TmdbTvShowEpisode;
	})
	@ValidateNested()
	public episodes?: TmdbTvShowEpisode[];
}
