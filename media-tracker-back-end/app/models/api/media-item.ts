/**
 * Model for a new media item to be created, publicly exposed via API
 */
export type NewMediaItem = {

	name: string;
	author?: string;
};

/**
 * Model for an existing media item, publicly exposed via API
 */
export type MediaItem = NewMediaItem & {

	uid: string;
};