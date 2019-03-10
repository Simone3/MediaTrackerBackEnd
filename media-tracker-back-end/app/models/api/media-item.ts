import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Model for a new media item to be created, publicly exposed via API
 */
export class NewMediaItem {

	/**
	 * The media item name
	 */
	@IsNotEmpty()
	@IsString()
	name!: string;

	/**
	 * The media item author
	 */
	@IsOptional()
	@IsString()
	author?: string;
};

/**
 * Model for an existing media item, publicly exposed via API
 */
export class MediaItem extends NewMediaItem {

	/**
	 * The media item unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};