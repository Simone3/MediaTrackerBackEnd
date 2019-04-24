import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Volume model (light) for the external book details service
 */
export class GoogleBooksVolumeLight {

	@IsNotEmpty()
	@IsString()
	public title!: string;

	@IsOptional()
	@IsString()
	public publishedDate?: string;

	@IsOptional()
	@IsNotEmpty({each: true})
	@IsString({each: true})
	public authors?: string[];
}

/**
 * Result of the external book search service
 */
export class GoogleBooksSearchResult {

	@IsNotEmpty()
	@IsString()
	public id!: string;

	@IsDefined()
	@Type(() => GoogleBooksVolumeLight)
	@ValidateNested()
	public volumeInfo!: GoogleBooksVolumeLight;
}

/**
 * Response of the external book search service
 */
export class GoogleBooksSearchResponse {

	@IsOptional()
	@IsDefined({each: true})
	@Type(() => GoogleBooksSearchResult)
	@ValidateNested()
	public items?: GoogleBooksSearchResult[];
}

/**
 * Image model for the external book details service
 */
export class GoogleBooksImageLinks {

	@IsOptional()
	@IsString()
	public medium?: string;

	@IsOptional()
	@IsString()
	public thumbnail?: string;
}

/**
 * Volume model (full) for the external book details service
 */
export class GoogleBooksVolumeFull extends GoogleBooksVolumeLight {

	@IsOptional()
	@IsNotEmpty({each: true})
	@IsString({each: true})
	public categories?: string[];

	@IsOptional()
	@IsString()
	public description?: string;

	@IsOptional()
	@IsInt()
	public pageCount?: number;

	@IsOptional()
	@Type(() => GoogleBooksImageLinks)
	@ValidateNested()
	public imageLinks?: GoogleBooksImageLinks;
}

/**
 * Response of the external book details service
 */
export class GoogleBooksDetailsResponse {

	@IsNotEmpty()
	@IsString()
	public id!: string;

	@IsDefined()
	@Type(() => GoogleBooksVolumeFull)
	@ValidateNested()
	public volumeInfo!: GoogleBooksVolumeFull;
}
