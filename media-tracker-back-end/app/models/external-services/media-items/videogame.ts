import { Type } from "class-transformer";
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

/**
 * Response of the external videogame search service
 */
export class GiantBombSearchResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombSearchResult)
	@ValidateNested()
	results?: GiantBombSearchResult[];
}

/**
 * Result of the external videogame search service
 */
export class GiantBombSearchResult {

	@IsNotEmpty()
	@IsInt()
	id!: number;
	
	@IsNotEmpty()
	@IsString()
	name!: string;

	@IsOptional()
	@IsString()
	original_release_date?: string;

	@IsOptional()
	@IsInt()
	expected_release_day?: number;

	@IsOptional()
	@IsInt()
	expected_release_month?: number;

	@IsOptional()
	@IsInt()
	expected_release_year?: number;
}

/**
 * Response of the external videogame details service
 */
export class GiantBombDetailsResponse {

	@IsDefined()
	@Type(() => GiantBombDetailsResult)
	@ValidateNested()
    results!: GiantBombDetailsResult;
}

/**
 * Result model for the external videogame details service
 */
export class GiantBombDetailsResult extends GiantBombSearchResult {
	
	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombGenre)
	@ValidateNested()
	genres?: GiantBombGenre[];

	@IsOptional()
	@IsString()
	deck?: string;

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombDeveloper)
	@ValidateNested()
	developers?: GiantBombDeveloper[];

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombPublisher)
	@ValidateNested()
	publishers?: GiantBombPublisher[];

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GiantBombPlatform)
	@ValidateNested()
	platforms?: GiantBombPlatform[];

	@IsOptional()
	@Type(() => GiantBombImage)
	@ValidateNested()
	image?: GiantBombImage;
}

/**
 * Image model for the external videogame details service
 */
export class GiantBombImage {

	@IsOptional()
	@IsString()
	screen_url?: string;

	@IsOptional()
	@IsString()
	medium_url?: string;
}

/**
 * Genre model for the external videogame details service
 */
export class GiantBombGenre {

	@IsNotEmpty()
	@IsString()
	name!: string;
}

/**
 * Publisher model for the external videogame details service
 */
export class GiantBombPublisher {

	@IsNotEmpty()
	@IsString()
	name!: string;
}

/**
 * Developer model for the external videogame details service
 */
export class GiantBombDeveloper {

	@IsNotEmpty()
	@IsString()
	name!: string;
}

/**
 * Platform model for the external videogame details service
 */
export class GiantBombPlatform {

	@IsNotEmpty()
	@IsString()
	name!: string;
	
	@IsOptional()
	@IsString()
	abbreviation?: string;
}
