import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Result of the external videogame search service
 */
export class GiantBombSearchResult {

	@IsNotEmpty()
	@IsInt()
	public id!: number;
	
	@IsNotEmpty()
	@IsString()
	public name!: string;

	@IsOptional()
	@IsString()
	public original_release_date?: string;

	@IsOptional()
	@IsInt()
	public expected_release_day?: number;

	@IsOptional()
	@IsInt()
	public expected_release_month?: number;

	@IsOptional()
	@IsInt()
	public expected_release_year?: number;
}

/**
 * Response of the external videogame search service
 */
export class GiantBombSearchResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombSearchResult)
	@ValidateNested()
	public results?: GiantBombSearchResult[];
}

/**
 * Genre model for the external videogame details service
 */
export class GiantBombGenre {

	@IsNotEmpty()
	@IsString()
	public name!: string;
}

/**
 * Publisher model for the external videogame details service
 */
export class GiantBombPublisher {

	@IsNotEmpty()
	@IsString()
	public name!: string;
}

/**
 * Developer model for the external videogame details service
 */
export class GiantBombDeveloper {

	@IsNotEmpty()
	@IsString()
	public name!: string;
}

/**
 * Platform model for the external videogame details service
 */
export class GiantBombPlatform {

	@IsNotEmpty()
	@IsString()
	public name!: string;
	
	@IsOptional()
	@IsString()
	public abbreviation?: string;
}

/**
 * Image model for the external videogame details service
 */
export class GiantBombImage {

	@IsOptional()
	@IsString()
	public screen_url?: string;

	@IsOptional()
	@IsString()
	public medium_url?: string;
}

/**
 * Result model for the external videogame details service
 */
export class GiantBombDetailsResult extends GiantBombSearchResult {
	
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombGenre)
	@ValidateNested()
	public genres?: GiantBombGenre[];

	@IsOptional()
	@IsString()
	public deck?: string;

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombDeveloper)
	@ValidateNested()
	public developers?: GiantBombDeveloper[];

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombPublisher)
	@ValidateNested()
	public publishers?: GiantBombPublisher[];

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombPlatform)
	@ValidateNested()
	public platforms?: GiantBombPlatform[];

	@IsOptional()
	@Type(() => GiantBombImage)
	@ValidateNested()
	public image?: GiantBombImage;
}

/**
 * Response of the external videogame details service
 */
export class GiantBombDetailsResponse {

	@IsDefined()
	@Type(() => GiantBombDetailsResult)
	@ValidateNested()
	public results!: GiantBombDetailsResult;
}

