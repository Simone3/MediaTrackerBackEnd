import { OldAppMediaItem } from 'app/data/models/api/import/old-app/media-item';
import { ValuesOf } from 'app/utilities/helper-types';
import { Type } from 'class-transformer';
import { IsDefined, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

/**
 * Array of all colors in the old Media Tracker app export, publicly exposed via API
 */
export const OLD_APP_COLORS: [ 'blue', 'red', 'green', 'orange', 'yellow', 'purple', 'cyan', 'grey' ] = [ 'blue', 'red', 'green', 'orange', 'yellow', 'purple', 'cyan', 'grey' ];

/**
 * A color in the old Media Tracker app export, publicly exposed via API
 */
export type OldAppColor = ValuesOf<typeof OLD_APP_COLORS>;

/**
 * Array of all media types in the old Media Tracker app export, publicly exposed via API
 */
export const OLD_APP_MEDIA_TYPES: [ 'BOOKS', 'MOVIES', 'TV_SHOWS', 'VIDEOGAMES' ] = [ 'BOOKS', 'MOVIES', 'TV_SHOWS', 'VIDEOGAMES' ];

/**
 * A category media type in the old Media Tracker app export, publicly exposed via API
 */
export type OldAppMediaType = ValuesOf<typeof OLD_APP_MEDIA_TYPES>;

/**
 * Model for a category in the old Media Tracker app export, publicly exposed via API
 */
export class OldAppCategory {

	/**
	 * The category name
	 */
	@IsNotEmpty()
	@IsString()
	public NAME!: string;

	/**
	 * The color
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(OLD_APP_COLORS)
	public COLOR_RESOURCE_NAME!: OldAppColor;

	/**
	 * The media type
	 */
	@IsNotEmpty()
	@IsString()
	@IsIn(OLD_APP_MEDIA_TYPES)
	public MEDIA_TYPE_NAME!: OldAppMediaType;

	/**
	 * The list of media items
	 */
	@IsOptional()
	@IsDefined({ each: true })
	@Type(() => {
		return OldAppMediaItem;
	})
	@ValidateNested()
	public MEDIA_ITEMS?: OldAppMediaItem[];
}
