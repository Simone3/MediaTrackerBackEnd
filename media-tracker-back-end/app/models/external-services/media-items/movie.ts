import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Result of the external movie search service
 */
export class TmdbMovieSearchResult {

	@IsNotEmpty()
	@IsInt()
	public id!: number;

	@IsNotEmpty()
	@IsString()
	public title!: string;

	@IsOptional()
	@IsString()
	public release_date?: string;
}

/**
 * Response of the external movie search service
 */
export class TmdbMovieSearchResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbMovieSearchResult)
	@ValidateNested()
	public results?: TmdbMovieSearchResult[];
}

/**
 * Crew model for the external movie details service
 */
export class TmdbMovieCrewPerson {

	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsOptional()
	@IsString()
	public job?: string;
}

/**
 * Credits model for the external movie details service
 */
export class TmdbMovieCredits {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbMovieCrewPerson)
	@ValidateNested()
	public crew?: TmdbMovieCrewPerson[];
}

/**
 * Genre model for the external movie details service
 */
export class TmdbMovieGenre {

	@IsNotEmpty()
	@IsString()
	public name!: string;
}

/**
 * Response of the external movie details service
 */
export class TmdbMovieDetailsResponse {

	@IsNotEmpty()
	@IsInt()
	public id!: number;
	
	@IsOptional()
	@IsString()
	public release_date?: string;
	
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => TmdbMovieGenre)
	@ValidateNested()
	public genres?: TmdbMovieGenre[];
	
	@IsNotEmpty()
	@IsString()
	public title!: string;
	
	@IsOptional()
	@IsString()
	public overview?: string;
	
	@IsOptional()
	@IsInt()
	public runtime?: number;
	
	@IsOptional()
	@Type(() => TmdbMovieCredits)
	@ValidateNested()
	public credits?: TmdbMovieCredits;
	
	@IsOptional()
	@IsString()
	public backdropPath?: string;
}
