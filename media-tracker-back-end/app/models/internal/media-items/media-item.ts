import { CategoryInternal } from 'app/models/internal/category';
import { PersistedEntityInternal } from 'app/models/internal/common';
import { GroupInternal } from 'app/models/internal/group';
import { UserInternal } from 'app/models/internal/user';
import { OwnPlatformInternal } from '../own-platform';

/**
 * Util type to extract common fields to both media item entities and catalog entries
 */
type CoreMediaItemDataInternal = {

	name: string;
	genres?: string[];
	description?: string;
	releaseDate?: Date;
	imageUrl?: string;
};

/**
 * Model for a media item with all properties, internal type NOT to be exposed via API
 */
export type MediaItemInternal = PersistedEntityInternal & CoreMediaItemDataInternal & {

	category: CategoryInternal | string;
	group?: GroupInternal | string;
	orderInGroup?: number;
	ownPlatform?: OwnPlatformInternal | string;
	owner: UserInternal | string;
	importance: number;
	userComment?: string;
	completedAt?: Date[];
	active?: boolean;
	catalogId?: string;
};

/**
 * Model for a media item filtering options, internal type NOT to be exposed via API
 */
export type MediaItemFilterInternal = {
	
	importance?: number;
	groupId?: string;
	ownPlatformId?: string;
};

/**
 * Values for ordering options, internal type NOT to be exposed via API
 */
export type MediaItemSortFieldInternal = 'IMPORTANCE' | 'NAME' | 'GROUP' | 'OWN_PLATFORM';

/**
 * Media items sort by options, internal type NOT to be exposed via API
 */
export type MediaItemSortByInternal = {

	ascending: boolean;
}

/**
 * Model for a media item with base properties, internal type NOT to be exposed via API
 */
export type CatalogMediaItemInternal = CoreMediaItemDataInternal & {

};

/**
 * Media item catalog search result, internal type NOT to be exposed via API
 */
export type SearchMediaItemCatalogResultInternal = {

	catalogId: string;
	name: string;
	releaseDate?: Date;
}

