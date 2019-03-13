import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Model for a media item, publicly exposed via API
 */
export class MediaItem {

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
 * Model for a media item with an ID property, publicly exposed via API
 */
export class IdentifiedMediaItem extends MediaItem {

	/**
	 * The media item unique ID
	 */
	@IsNotEmpty()
	@IsString()
	uid!: string;
};