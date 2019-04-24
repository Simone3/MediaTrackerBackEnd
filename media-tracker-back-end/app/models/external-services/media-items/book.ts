import { Type } from "class-transformer";
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

/**
 * Response of the external book search service
 */
export class GoogleBooksSearchResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GoogleBooksSearchResult)
	@ValidateNested()
	items?: GoogleBooksSearchResult[];
}


/**
 * Result of the external book search service
 */
export class GoogleBooksSearchResult {

	@IsNotEmpty()
	@IsString()
	id!: string;

	@IsDefined()
	@Type(() => GoogleBooksVolumeLight)
	@ValidateNested()
	volumeInfo!: GoogleBooksVolumeLight;
}

/**
 * Volume model (light) for the external book details service
 */
export class GoogleBooksVolumeLight {

	@IsNotEmpty()
	@IsString()
	title!: string;

	@IsOptional()
	@IsString()
	publishedDate?: string;

	@IsOptional()
	@IsNotEmpty({each: true})
	@IsString({each: true})
	authors?: string[];
}

/**
 * Response of the external book details service
 */
export class GoogleBooksDetailsResponse {

	@IsNotEmpty()
	@IsString()
    id!: string;

	@IsDefined()
	@Type(() => GoogleBooksVolumeFull)
	@ValidateNested()
    volumeInfo!: GoogleBooksVolumeFull;
}

/**
 * Volume model (full) for the external book details service
 */
export class GoogleBooksVolumeFull extends GoogleBooksVolumeLight {

	@IsOptional()
	@IsNotEmpty({each: true})
	@IsString({each: true})
	categories?: string[];

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsInt()
	pageCount?: number;

	@IsOptional()
	@Type(() => GoogleBooksImageLinks)
	@ValidateNested()
	imageLinks?: GoogleBooksImageLinks;
}

/**
 * Image model for the external book details service
 */
export class GoogleBooksImageLinks {

	@IsOptional()
	@IsString()
	medium?: string;

	@IsOptional()
	@IsString()
	thumbnail?: string;
}
